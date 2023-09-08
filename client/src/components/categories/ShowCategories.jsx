import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import AddCategoryModal from "./AddCategoryModal";
import SuccessMsg from "../Messages/SuccessMsg";
import ErrorMsg from "../Messages/ErrorMsg";
import { getCategories } from "../../redux/categories/categoriesApiCalls";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";

const ShowCategories = () => {
  const { categories } = useSelector((state) => state.categories);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState()
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getCategories())
      if(response === true) {
        setError([])
        setErrorModal(false)
      } else {
        setErrorModal(true)
        setError(response)
      }
    }
    fetchData()
  }, [dispatch])

  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setEditModal(true)
  }

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category)
    setDeleteModal(true)
  }
  
  return (
    <div className="w-full">
      {errorModal && <ErrorMsg error={error} modal={errorModal} toggle={() => setErrorModal(!errorModal)} />}
      {showSuccessMsg && <SuccessMsg modal={showSuccessMsg} toggle={() => setShowSuccessMsg(!showSuccessMsg)}/>}

      <AddCategoryModal setShowSuccessMsg={setShowSuccessMsg} />
      {editModal && 
        <EditCategory 
          modal={editModal}
          toggle={() => setEditModal(!editModal)} 
          setShowSuccessMsg={setShowSuccessMsg} 
          selectedCategory={selectedCategory} 
        />
      }

      {deleteModal && 
        <DeleteCategory 
          modal={deleteModal}
          toggle={() => setDeleteModal(!deleteModal)} 
          setShowSuccessMsg={setShowSuccessMsg} 
          selectedCategory={selectedCategory} 
        />
      }

      <div className="grid grid-cols-4 gap-2">
        {categories.length > 0 &&
          categories.map((category) => (
            <div className="bg-white border shadow-md rounded px-4 py-2" key={category._id}>
              <p>{category.name}</p>
              <div className="flex justify-center items-center gap-2">
                <FaEdit 
                  style={{ fontSize: "22px" }}
                  className="text-green"
                  onClick={() => handleEditCategory(category)}
                />
                <CiCircleRemove
                  style={{ fontSize: "22px" }}
                  className="text-red"
                  onClick={() => handleDeleteCategory(category)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShowCategories;
