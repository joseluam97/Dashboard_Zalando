const Productos = require("../models/Producto");
const HistoricoPrecios = require("../models/HistoricoPrecios");

const historicoPreciosCtrl = {};

historicoPreciosCtrl.postHistoricoPrecios = async (req, res) => {
  console.log(req.body);
  const { idProducto, price, talla, disponible} = req.body;

  try {
    // Obtener la fecha y hora actual
    const fechaActual = new Date();

    // Verificar si ya existe un precio registrado para el mismo día
    const precioExistente = await HistoricoPrecios.findOne({
      idProducto,
      talla,
      date: {
        $gte: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 0, 0, 0),
        $lt: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + 1, 0, 0, 0),
      },
    });

    if (precioExistente) {
      return res.status(400).json({ error: 'Ya existe un precio registrado para el día actual.' });
    }

    const historicoPrecios = new HistoricoPrecios({
      idProducto,
      talla,
      price,
      date: new Date(),
      disponible,
    });

    const newHistoricoPrecios = await historicoPrecios.save();
    res.json(newHistoricoPrecios);
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

/*historicoPreciosCtrl.postHistoricoPrecios = async(req, res) => {z
  console.log(req.body);
  const historicoPrecios = new HistoricoPrecios({
    idProducto: req.body.idProducto,
    price: req.body.price,
    date: new Date(),
  });
  try{
      const newHistoricoPrecios = await historicoPrecios.save();
      res.json(newHistoricoPrecios);
  }catch(err){
      console.log(err);
      res.json({message: err.message});
  }
};*/

historicoPreciosCtrl.putHistoricoPrecios = async (req, res) => {
  try {
		const post = await HistoricoPrecios.findOne({ _id: req.params.id })

		if (req.body.idProducto) {
			post.idProducto = req.body.idProducto
		}
		if (req.body.price) {
			post.price = req.body.price
		}
    if (req.body.date) {
			post.date = req.body.date
		}
    if (req.body.talla) {
			post.talla = req.body.talla
		}
    if (req.body.disponible) {
			post.disponible = req.body.disponible
		}

		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
};

historicoPreciosCtrl.getPricesByProduct = async(req, res) => {
  try {
    const { id } = req.params;
		const prices = await HistoricoPrecios.find({ idProducto: id })

		res.send(prices)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
};

historicoPreciosCtrl.getPricesByProductAndTalla = async (req, res) => {
  try {
    const idProducto = req.params.id;
    const tallaProvided = req.query.talla;

    if(tallaProvided == undefined || tallaProvided == ""){
      return res.status(404).json({ error: 'Debe proporcionar una talla' });
    }

    // Obtener información básica del producto
    const producto = await Productos.findById(idProducto);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Utilizar el modelo HistoricoPrecio para realizar la consulta
    const precios = await HistoricoPrecios.find({
      idProducto,
      talla: tallaProvided,
    }).sort({ date: -1 }); // Ordenar por fecha descendente para obtener el precio más reciente primero

    let respuesta;
    if (precios.length != 0) {
      // Obtener el precio actual (más reciente)
      const precioActual = precios[0].price;

      // Formatear el vector de precios con fecha y precio
      const vectorPrecios = precios.map(precio => ({ fecha: precio.date, precio: precio.price }));

      // Calcular estadísticas de precios
      const precioMaximo = Math.max(...precios.map(precio => precio.price));
      const precioMinimo = Math.min(...precios.map(precio => precio.price));
      let precioMedio = precios.reduce((sum, precio) => sum + precio.price, 0) / precios.length;
      precioMedio = precioMedio.toFixed(2);

      // Calcular porcentaje de cambio, manejando la posibilidad de que el precio medio sea cero
      let porcentajeCambio = 0
      if(precioActual != precioMedio){
        porcentajeCambio = -1 * (100  - ((precioActual * 100) / precioMedio))
        porcentajeCambio = porcentajeCambio.toFixed(2);
      }
    
      respuesta = {
        precioActual,
        porcentajeCambio,
        precioMaximo,
        precioMinimo,
        precioMedio,
        numeroRegistros: precios.length,
        vectorPrecios,
      };
    }
    else{
      res.json([]);
    }

    res.json(respuesta);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = historicoPreciosCtrl;