const express = require('express');
const router = express.Router();

//Modelos
const Productos = require('../models/Producto');
const producto = require("../controllers/productos.controller");

router.post("/byName", function (req, res) {
  const nameParams = req.body.name;
  //const linkParams = req.body.link;
  Productos.find({ name: nameParams }, function (err, producto) {
    if (err) {
      console.error('Error al obtener los productos:', err);
      res.status(500).json({ error: 'Error al obtener los productos' });
    } else {
      res.status(200).json(producto);
    }
  });
});

router.get('/', producto.getAllProduct);
router.get('/getBestOffertByBrand', producto.getBestOffertByBrand);
router.get('/byBrand', producto.getAllProductByBrand);
router.post('/byBrandJson', producto.getAllProductByBrandJson);
router.get('/deletePricesProducts', producto.deletePricesProducts);
router.get('/byIdZalando/:id_zalando', producto.getProductoByIdZalando);
router.post('/', producto.postProducto);
router.put("/:id", producto.putProducto);
router.get('/allBrand', producto.getAllBrand);
router.get('/checkProductHavePrices/', producto.getCheckProductHavePrices);
router.get('/allSize/', producto.getAllSize);
router.get('/allSizeByZapato/:id', producto.getSizesByProducto);
router.get('/:id', producto.getProductoById);

router.delete("/:id", function (req, res) {
  const { id } = req.params;
  Productos.findByIdAndRemove(id, (error, producto) => {
    if (!error) {
      console.log(producto)
    }
  });
});

module.exports = router;