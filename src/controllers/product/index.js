const Product = require("../../models/ProductModels");

// image
const multer = require("multer");
const path = require("path");

const getProduct = async (req, res) => {
  const { search, limit, page } = req.query;
  try {
    let product = await Product.findAll({
      attributes: ["id", "name", "price", "image", "description", "stock"],
      limit: Number(limit) || 10,
      offset: Number(page) || 0,
      order: [["createdAt", "ASC"]],
    });
    if (search && typeof search !== "undefined") {
      let filteredProduct = [];
      product.forEach((product) => {
        if (
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.price
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          product.stock.toString().toLowerCase().includes(search.toLowerCase())
        ) {
          filteredProduct.push(product);
        }
      });
      product = filteredProduct;
    }

    res.json({
      status: "success",
      total: ` ${product.length}`,
      total_page: Math.ceil((await Product.count()) / limit),
      data: product,
    });
  } catch (error) {
    console.log(error);
  }
};

// get product id 

const getProductById = async (req, res) => {
    const {id} = req.query;
    try {
     const Data =   await Product.findOne({
        attributes: ["id", "name", "price", "image", "description", "stock"],
            where : {
                id : id
            }
        })
        res.json({
            status : "err",
            data : Data
        })
    } catch (err) {
        res.json({
            status : "failed",
            err
        })
    }
}

// add data product
const addProduct = async (req, res) => {
  const { name, price, stock, description } = req.body;
  const image = req.file;
  try {
    const datapost = await Product.create({
      name: name,
      price: price,
      stock: stock,
      image: image.path,
      imagePath: image.filename,
      description: description,
    });
    res.json({
      status: "success",
      message: "Product successfully added",
      data: datapost,
    });
  } catch (error) {
    console.log(error);
  }
};

// update image controller
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, res, cb) => {
    cb(null, Date.now() + path.extname(res.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, res, cb) => {
    const fileTypes = /jpg|jpeg|png|gif/;
    const extName = fileTypes.test(
      path.extname(res.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(res.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only support image"));
    }
  },
}).single("image");

// update data product
const updateProduct = async (req, res) => {
  try {
    const {id} = req.query;
    const {name, price, stock, description} = req.body;
    const image = req.file;
    const product = await Product.findByPk(id)

    if (!product) {
        return res.status(404).json({msg : "Product Not Found"})
    }

    if (image) {
        product.image = image.path
        product.imagePath = image.filename
    }
    if(name) {
        product.name = name
    }
    if(price) {
        product.price = price
    }
    if(stock) {
        product.stock = stock
    }
    if(description) {
        product.description = description
    }

    await product.save()

    res.json(product)
    // await Product.update(
    //   {
    //     name: name || data[0].name,
    //     price: price || data[0].price,
    //     stock: stock || data[0].stock,
    //     image: image.path || data[0].image,
    //     imagePath: image.filename || data.imagePath,
    //     description: description || data.description,
    //   },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );
    // res.json({
    //   status: "success",
    // });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Product not found",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.query;
  try {
    await Product.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      msg: "product not exist",
    });
  }
};

module.exports = {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  upload,
};
