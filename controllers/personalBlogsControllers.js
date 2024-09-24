const db = require("../config/db");
const Blogs = db.blogs;

// Create a personal blog

const createPersonalBlog = async (req, res) => {
  try {
    // Ensure blogData is being passed as a string and parsed correctly
    const blogData = req.body.blogData ? JSON.parse(req.body.blogData) : null;
    
    if (!blogData) {
      return res.status(400).send({
        success: false,
        message: "Invalid blog data format",
      });
    }

    // Check if file exists
    const imageName = req.file ? req.file.filename : null;

    const { title, author, blogContent } = blogData;
    
    // Validate the presence of all required fields
    if (!title || !author || !blogContent) {
      return res.status(404).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const blogObj = {
      title: title,
      author: author,
      blogContent: blogContent,
      image: imageName, // Save the image path if available
    };

    const data = await Blogs.create(blogObj);

    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(201).send({
      success: true,
      message: "New personal blog created Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in Create Personal blog API",
      error: error.message,
    });
  }
};


const getAllPersonalBlog = async (req, res) => {
  try {
    const data = await Blogs.findAll();
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Personal Blogs NOT found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All Personal Blogs records",
      totalLength: data.length,
      result: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Personal Blogs api",
      error: error,
    });
  }
};

const getPersonalBlog = async (req, res) => {
  try {
    const blodID = req.params.id;
    if (!blodID) {
      return res.status(404).send({
        success: false,
        message: "Blog ID is Invalid..",
      });
    }
    const data = await Blogs.findByPk(req.params.id);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "NO Blogs Found",
      });
    }
    res.status(200).send({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update personal blog
// const updatePersonalBlog = async (req, res) => {
//   try {
//     const blogID = req.params.id;
//     if (!blogID) {
//       return res.status(404).send({
//         success: false,
//         message: "Blog ID is NOT Found",
//       });
//     }
//     const blogData = JSON.parse(req.body.blogData);
//     const imageName = req.file.filename;

//     const { title, author, blogContent } = blogData;

//     const newdata = {
//       title: title,
//       author: author,
//       blogContent: blogContent,
//       image: imageName,
//     };

//     const data = await Blogs.update(newdata, {
//       where: { id: req.params.id },
//     });
//     if (!data) {
//       return res.status(500).send({
//         success: false,
//         message: "Error in Update the personal blog",
//       });
//     }
//     res.status(200).send({
//       success: true,
//       message: "Personal Blog Updated Successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error In Update personal blogs API",
//       error: error,
//     });
//   }
// };


const updatePersonalBlog = async (req, res) => {
  try {
    const blogID = req.params.id;
    if (!blogID) {
      return res.status(400).send({ // Changed to 400 for bad request
        success: false,
        message: "Blog ID is not found",
      });
    }

    const blogData = JSON.parse(req.body.blogData); // Assuming blogData is sent as a JSON string
    const imageName = req.file ? req.file.filename : null; // Check if file exists

    const { title, author, blogContent } = blogData;

    const newdata = {
      title,
      author,
      blogContent,
      image: imageName,
    };

    const [updated] = await Blogs.update(newdata, {
      where: { id: blogID },
    });

    if (!updated) {
      return res.status(404).send({ // Changed to 404 for not found
        success: false,
        message: "Blog not found or no changes made",
      });
    }

    res.status(200).send({
      success: true,
      message: "Personal Blog Updated Successfully",
      data: newdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating personal blog",
      error: error.message || "Internal Server Error",
    });
  }
};


// Delete perticular personal blog
const deletePersonalBlog = async (req, res) => {
  try {
    const blodID = req.params.id;
    if (!blodID) {
      return res.status(404).send({
        success: false,
        message: "Blog ID not Found!",
      });
    }
   
    const deleted = await Blogs.destroy({
      where: { id: blodID },
    });

    if (deleted === 0) { 
      return res.status(200).send({
        success: false,
        message: "Blog ID not Found!",
      });
    }


    return res.status(200).send({
      success: true,
      message: "Personal blog Delete Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createPersonalBlog,
  getAllPersonalBlog,
  getPersonalBlog,
  updatePersonalBlog,
  deletePersonalBlog,
};
