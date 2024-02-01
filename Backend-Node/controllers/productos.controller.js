const Productos = require("../models/Producto");
const Precios = require("../models/HistoricoPrecios");

const { ObjectId } = require("mongodb");

const productoCtrl = {};
const marcasFiltradas = [
  "Nike",
  "Adidas",
  "Vans",
  "Converse",
  "New Balance",
  "Puma",
  "Jordan",
];

productoCtrl.getBestOffertByBrand = async (req, res) => {
  const { brand } = req.body;

  const productsFilter = await Productos.find({ brand: brand });
  vectorResultado = [];

  for (const producto of productsFilter) {
    const idProducto = producto._id;

    // Obtener los precios del producto ordenados por fecha
    const precios = await Precios.find({ idProducto }).sort({ date: 1 }); // Orden ascendente por fecha

    if (precios.length >= 2) {
      const primerPrecio = precios[0].price;
      const ultimoPrecio = precios[precios.length - 1].price;
      const penultimoPrecio = precios[precios.length - 2].price;

      const diferenciaUltimoPrimer = ultimoPrecio - primerPrecio;
      const diferenciaUltimoPenultimo = ultimoPrecio - penultimoPrecio;

      vectorResultado.push({
        name: producto.name,
        diferenciaUltimoPrimer: diferenciaUltimoPrimer,
        diferenciaUltimoPenultimo: diferenciaUltimoPenultimo,
      });
    }
  }

  resultadoFinal = vectorResultado.sort(
    (a, b) => b.diferenciaUltimoPrimer - a.diferenciaUltimoPrimer
  );

  res.json(resultadoFinal);
};

productoCtrl.getAllBrand = async (req, res) => {
  const marcasUnicas = await Productos.distinct("brand", {
    brand: { $regex: new RegExp(marcasFiltradas.join("|"), "i") },
  });

  res.status(200).send(marcasUnicas);
};

productoCtrl.getAllSize = async (req, res) => {
  const tallasUnicas = await Precios.distinct("talla", {});

  res.status(200).send(tallasUnicas);
};

productoCtrl.getSizesByProducto = async (req, res) => {
  const idProducto_ = req.params.id;

  const tallasUnicas = await Precios.find({ idProducto: idProducto_ }).distinct(
    "talla",
    {}
  );

  res.status(200).send(tallasUnicas);
};

productoCtrl.getProductoByIdZalando = async (req, res) => {
  const id_producto_zalando = req.params.id_zalando;

  const productoFind = await Productos.findOne({
    id_zalando: id_producto_zalando,
  });

  if (productoFind == null) {
    res.status(200).json({});
  } else {
    res.status(200).json(productoFind);
  }
};

productoCtrl.postProducto = async (req, res) => {
  console.log(req.body);
  const producto = new Productos({
    id_zalando: req.body.id_zalando,
    name: req.body.name,
    color: req.body.color,
    brand: req.body.brand,
    imagen: req.body.imagen,
    link: req.body.link,
  });
  try {
    const newProducto = await producto.save();
    res.json(newProducto);
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

productoCtrl.putProducto = async (req, res) => {
  try {
    const post = await Productos.findOne({ _id: req.params.id });

    if (req.body.id_zalando) {
      post.id_zalando = req.body.id_zalando;
    }
    if (req.body.name) {
      post.name = req.body.name;
    }
    if (req.body.color) {
      post.color = req.body.color;
    }
    if (req.body.brand) {
      post.brand = req.body.brand;
    }
    if (req.body.imagen) {
      post.imagen = req.body.imagen;
    }
    if (req.body.link) {
      post.link = req.body.link;
    }

    await post.save();
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
};

productoCtrl.getProductoById = async (req, res) => {
  try {
    const idProducto = req.params.id;

    // Obtener información básica del producto
    const producto = await Productos.findById(idProducto);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

productoCtrl.getAllProduct = async (req, res) => {
  try {
    // Agregación para obtener los productos con sus precios actuales y medios
    const tallaProvided = req.query.talla;

    let productosConPrecios = [];

    if (tallaProvided == undefined) {
      productosConPrecios = await Productos.find({});
    } else {
      productosConPrecios = await Precios.aggregate([
        {
          $match: {
            talla: tallaProvided,
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $group: {
            _id: "$idProducto",
            precio_actual_talla: { $first: "$price" },
            disponible: { $first: "$disponible" },
            precios: { $push: "$price" }, // Agregar todos los precios a un array
          },
        },
        {
          $lookup: {
            from: "productos", // Nombre de la colección de productos
            localField: "_id",
            foreignField: "_id",
            as: "producto",
          },
        },
        {
          $unwind: "$producto",
        },
        {
          $project: {
            _id: "$producto._id",
            id_zalando: "$producto.id_zalando",
            name: "$producto.name",
            color: "$producto.color",
            brand: "$producto.brand",
            imagen: "$producto.imagen",
            link: "$producto.link",
            precio_actual_talla: 1,
            disponible: 1,
            precio_medio: { $avg: "$precios" }, // Calcular el precio medio
            porcentaje_cambio: {
              $cond: {
                if: { $ne: [{ $avg: "$precios" }, 0] }, // Evitar la división por cero
                then: {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $subtract: [
                            "$precio_actual_talla",
                            { $avg: "$precios" },
                          ],
                        },
                        { $avg: "$precios" },
                      ],
                    },
                    100,
                  ],
                },
                else: 0, // En caso de división por cero, establecer el porcentaje a 0
              },
            },
          },
        },
      ]);
    }

    productosConPrecios = productosConPrecios.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // Convierte a mayúsculas para asegurar la ordenación correcta
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    res.status(200).send(productosConPrecios);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

productoCtrl.getAllProductByBrandJson = async (req, res) => {
  try {
    // Agregación para obtener los productos con sus precios actuales y medios
    const dataJson = req.body;

    let productosBestOffert = [];

    for (let elemento in dataJson) {
      let marca = dataJson[elemento]["marca"];
      let talla = dataJson[elemento]["talla"];

      const productosBestOffertByBrand = await Precios.aggregate([
        {
          $lookup: {
            from: "productos",
            localField: "idProducto",
            foreignField: "_id",
            as: "producto_info",
          },
        },
        {
          $unwind: "$producto_info",
        },
        {
          $match: {
            talla: talla,
            "producto_info.brand": marca,
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $group: {
            _id: "$idProducto",
            precio_actual_talla: { $first: "$price" },
            disponible: { $first: "$disponible" },
            precios: { $push: "$price" },
          },
        },
        {
          $lookup: {
            from: "productos",
            localField: "_id",
            foreignField: "_id",
            as: "producto",
          },
        },
        {
          $unwind: "$producto",
        },
        {
          $project: {
            _id: "$producto._id",
            id_zalando: "$producto.id_zalando",
            name: "$producto.name",
            color: "$producto.color",
            brand: "$producto.brand",
            imagen: "$producto.imagen",
            link: "$producto.link",
            precio_actual_talla: 1,
            disponible: 1,
            precio_medio: { $avg: "$precios" },
            porcentaje_cambio: {
              $cond: {
                if: { $ne: [{ $avg: "$precios" }, 0] },
                then: {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $subtract: [
                            "$precio_actual_talla",
                            { $avg: "$precios" },
                          ],
                        },
                        { $avg: "$precios" },
                      ],
                    },
                    100,
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $match: {
            porcentaje_cambio: { $ne: 0 }, // Filtrar solo los que tienen descuento
          },
        },
        {
          $sort: {
            porcentaje_cambio: 1, // Ordenar de menor a mayor descuento
          },
        },
        {
          $limit: 5, // Obtener solo los 5 primeros
        },
      ]);

      productosBestOffert.push({ 
        "brand": marca,
        "list": productosBestOffertByBrand 
      });
    }
    res.status(200).send(productosBestOffert);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

productoCtrl.getAllProductByBrand = async (req, res) => {
  try {
    // Agregación para obtener los productos con sus precios actuales y medios
    const tallaProvided = req.query.talla;
    const marcaProvided = req.query.brand;

    if (tallaProvided == undefined || marcaProvided == undefined) {
      res.status(400).send("Debe proporciona la talla y la marca");
      return [];
    }

    let productosConPrecios = [];

    productosConPrecios = await Precios.aggregate([
      {
        $lookup: {
          from: "productos",
          localField: "idProducto",
          foreignField: "_id",
          as: "producto_info",
        },
      },
      {
        $unwind: "$producto_info",
      },
      {
        $match: {
          talla: tallaProvided,
          "producto_info.brand": marcaProvided,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      {
        $group: {
          _id: "$idProducto",
          precio_actual_talla: { $first: "$price" },
          disponible: { $first: "$disponible" },
          precios: { $push: "$price" },
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: "$producto._id",
          id_zalando: "$producto.id_zalando",
          name: "$producto.name",
          color: "$producto.color",
          brand: "$producto.brand",
          imagen: "$producto.imagen",
          link: "$producto.link",
          precio_actual_talla: 1,
          disponible: 1,
          precio_medio: { $avg: "$precios" },
          porcentaje_cambio: {
            $cond: {
              if: { $ne: [{ $avg: "$precios" }, 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$precio_actual_talla",
                          { $avg: "$precios" },
                        ],
                      },
                      { $avg: "$precios" },
                    ],
                  },
                  100,
                ],
              },
              else: 0,
            },
          },
        },
      },
    ]);

    productosConPrecios = productosConPrecios.filter(
      (elemento) => elemento.disponible == true
    );

    productosConPrecios = productosConPrecios.sort(
      (a, b) => a.porcentaje_cambio - b.porcentaje_cambio
    );

    res.status(200).send(productosConPrecios);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

productoCtrl.getCheckProductHavePrices = async (req, res) => {
  try {
    // Obtener la fecha y hora actual
    const fechaActual = new Date();

    // Convertir la fecha a un rango para el día actual
    const inicioDia = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate(),
      0,
      0,
      0
    );
    const finDia = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate() + 1,
      0,
      0,
      0
    );

    // Obtener productos que NO tienen un precio para el día actual
    const productosSinPrecioHoy = await Productos.find({
      _id: {
        $nin: await Precios.distinct("idProducto", {
          date: {
            $gte: inicioDia,
            $lt: finDia,
          },
        }),
      },
    });

    console.log(
      "Hay un total de " +
        productosSinPrecioHoy.length +
        " productos sin precio a dia de hoy."
    );

    res.status(200).send(productosSinPrecioHoy);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

productoCtrl.deletePricesProducts = async (req, res) => {
  const listPricesNoDisponible = await Precios.find({
    disponible: false,
  });

  for (let elemento in listPricesNoDisponible) {
    console.log("-elemento-");
    console.log(listPricesNoDisponible[elemento]);

    await Precios.findByIdAndDelete({
      _id: listPricesNoDisponible[elemento]["_id"],
    });
  }

  res.status(200).send([]);
};

module.exports = productoCtrl;
