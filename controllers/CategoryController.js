const CategoryModel = require("../models/CategoryModel")
const ProductModel = require("../models/ProductModel");

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 })
    res.status(200).json({success: categories});
  } catch (err) {
    res.status(500).json({err: err.message});
  }
}

const addCategory = async (req, res) => {
  try {
    const { name } = req.body
    const checkNameExist = await CategoryModel.findOne({name})
    const formErrors = []
    if(name.length === 0) {
      formErrors.push("le nom est obligatoire..")
    }
    if(checkNameExist) {
      formErrors.push("le nom existe deja")
    }
    if(formErrors.length === 0) {
      await CategoryModel.create({name})
      await getCategories(req, res)
      // res.status(200).json({success: newCat});
    }else {
      res.status(300).json({formErrors});
    }
  } catch (err) {
    res.status(500).json({err: err.message});
  }
}

const updateCategory = async (req, res) => {
  try {
    const { catId } = req.params
    const { name } = req.body
    const checkNameExist = await CategoryModel.findOne({_id: {$ne: catId}, name})
    const formErrors = []
    if(name.length === 0) {
      formErrors.push("le nom est obligatoire..")
    }
    if(checkNameExist) {
      formErrors.push("le nom existe deja")
    }
    if(formErrors.length === 0) {
      await CategoryModel.updateOne({_id: catId}, {$set: {name}}, { new: true })
      await getCategories(req, res)
      
      // res.status(200).json({success: updatedCat});
    }else {
      res.status(300).json({formErrors});
    }
  } catch (err) {
    res.status(500).json({err: err.message});
  }
}

const deleteCategory  = async (req, res) => {
  try {
    const { catId } = req.params
    const checkExistInProduct = await ProductModel.findOne({ catId: catId });
    const formErrors = []
    if(checkExistInProduct) {
      formErrors.push("Category ne peut pas etre supprimer car, elle existe dans un produit")
    }

    if(formErrors.length === 0) {
      await CategoryModel.deleteOne({_id: catId})
      await getCategories(req, res)
      // res.status(200).json({success: deleteProduct});
    } else {
      res.status(300).json({formErrors});
    }
  } catch(err) {
    res.status(500).json({err: err.message});

  }
}

module.exports = { getCategories, addCategory, updateCategory, deleteCategory }