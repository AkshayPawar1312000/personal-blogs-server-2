const supertest = require("supertest");
const app = require("../index");
const request = supertest(app);
const db = require("../config/db"); // Import your database configuration
const bcrypt = require("bcrypt");

require("dotenv").config();

beforeAll(async () => {
  // Optionally, you can sync the database or do other setup here
  await db.sequelize.sync();
});

afterAll(async () => {
  // Close the database connection
  await db.sequelize.close();
});


//  User test cases
// Add user
describe("POST /user", () => {
  test("should create a new user and return the user data", async () => {
    const userData = {
      name: "Dipak pawar",
      email: "dipak@123gmail.com",
      password: "Dipak@123",
    };

    const res = await request
      .post("/user")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("New User added successfully");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(userData.email);
    expect(res.body.data.name).toBe(userData.name);
  });

  test("should return 400 if any field is missing", async () => {
    const userData = {
      name: "Dipak Pawar",
      email: "", // Missing email
      password: "Dipak@123",
    };
    const res = await request
      .post("/user")
      .send(userData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Please provide all fields");
  });
});

describe("POST /userLogin", () => {
  test("should log in the user and return user data with a valid token", async () => {
    // Mock user data
    const userData = {
      email: "dipak@123gmail.com",
      password: "Dipak@123",
    };

    // Hash the password and mock the user in the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const mockUser = {
      id: 1,
      name: "Dipak Pawar",
      email: userData.email,
      password: hashedPassword,
    };

    const res = await request.post("/userLogin").send(userData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User login successful");
    expect(res.body.data.email).toBe(userData.email);
    expect(res.body.data.name).toBe(mockUser.name);
    expect(res.headers['set-cookie']).toBeDefined(); // Check if the token is set in the cookie
  });

  test("should return 400 if email or password is missing", async () => {
    const res = await request
      .post("/userLogin")
      .send({ email: "Dipak@123" }); // Missing password

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Email and password are required.");
  });

  test("should return 404 if the user is not found", async () => {

    const userData = {
      email: "nonexistent@example.com",
      password: "wrongpassword",
    };

    const res = await request
      .post("/userLogin")
      .send(userData)
      .expect(200)

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found. Please check Email or Password.");
  });

  test("should return 400 if the password is incorrect", async () => {
    // Mock user data with a hashed password
    const userData = {
      email: "dipak@123gmail.com",
      password: "wrongpassword",
    };

    const hashedPassword = await bcrypt.hash("Dipak@123", 10);
    const mockUser = {
      id: 1,
      email: userData.email,
      password: hashedPassword,
    };

    const res = await request
      .post("/userLogin")
      .send(userData);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid password.");
  });

});

// Get all personal blogs
describe("GET /personalBlogs", () => {
  test("should return all personal blogs", async () => {
    const res = await request.get("/personalBlogs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.length).toBeGreaterThan(0);
  });
});

// Get a blog
describe("GET /personalBlog/:id", () => {
  let testBlogId;
  beforeAll(async () => {
    // Create a test blog to retrieve
    const result = await db.sequelize.models.personal_blogs.create({
      title: "Test Blog",
      author: "Test Author",
      blogContent: "This is a test blog content.",
      image: "test-image-url",
    });
    testBlogId = result.id;
  });

  test("should return 404 for a non-existent blog ID", async () => {
    const res = await request.get(`/personalBlog/999999`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("NO Blogs Found");
  });

  test("should return a specific personal blog", async () => {
    const res = await request.get(`/personalBlog/${testBlogId}`);
    // console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();// not undefined
    expect(res.body.data.id).toBe(testBlogId);
    expect(res.body.data.title).toBe("Test Blog");
  });
});


// Delete personal blog
describe("DELETE /delete/:id", () => {
  let testBlogId;
  beforeAll(async () => {
    // Create a test blog to delete
    const result = await db.sequelize.models.personal_blogs.create({
      title: "Test Blog to Delete",
      author: "Test Author",
      blogContent: "This is a test blog content to delete.",
      image: "test-image-url",
    });
    testBlogId = result.id;
  });

  test("should return 200 with failure message for non-existent blog ID", async () => {
    const res = await request
      .delete(`/delete/999`)
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU"
      );

    expect(res.status).toBe(200); // Changed from 404 to 200
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Blog ID not Found!");
  });

  test("should delete a specific personal blog", async () => {
    const res = await request
      .delete(`/delete/${testBlogId}`)
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU"
      );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Personal blog Delete Successfully");
  });
});


// Create a personal blog
// describe("POST /personalBlog", () => {
//   test("should create a new blog and return the blog data", async () => {
//     const blogData = {
//       title: "New Blog Post",
//       author: "Dipak Pawar",
//       blogContent: "This is the content of the blog post.",
//       // image: "image_1726154695904.png",
//     };
//     const jsonData = JSON.stringify(blogData);
//     const res = await request
//       .post("/personalBlog")
//       .set("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU") // Use a valid test token
//       // .send(blogData)
//       .field("blogData", jsonData) 

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toBe("New personal blog created Successfully");
//     expect(res.body.data).toBeDefined();
//     expect(res.body.data.title).toBe(blogData.title);
//     expect(res.body.data.author).toBe(blogData.author);
//   });

//   test("should return 400 if any required field is missing", async () => {
//     const blogData = {
//       title: "New Blog Post",
//       author: "", // Missing author
//       blogContent: "This is the content of the blog post.",
//     };
//     const res = await request
//       .post("/personalBlog")
//       .set("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU") // Use a valid test token
//       .field("title", blogData.title)
//       .field("author", blogData.author)
//       .field("blogContent", blogData.blogContent);

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBe(false);
//     expect(res.body.message).toBe("Please provide all required fields");
//   });
// });

describe("POST /personalBlog", () => {
  test("should create a new blog and return the blog data", async () => {
    const blogData = {
      title: "New Blog Post",
      author: "Dipak Pawar",
      blogContent: "This is the content of the blog post.",
    };

    const jsonData = JSON.stringify(blogData); // Convert the blog data to JSON string

    const res = await request
      .post("/personalBlog")
      .set("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU") // Use a valid test token
      .set("Content-Type", "multipart/form-data") // Set the content type to form data
      .field("blogData", jsonData) // Send the blogData as a field
   

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("New personal blog created Successfully");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.title).toBe(blogData.title);
    expect(res.body.data.author).toBe(blogData.author);
    expect(res.body.data.blogContent).toBe(blogData.blogContent);
  });

  test("should return 404 if any required field is missing", async () => {
    const blogData = {
      title: "New Blog Post",
      author: "", // Missing author
      blogContent: "This is the content of the blog post.",
    };

    const jsonData = JSON.stringify(blogData); // Convert the blog data to JSON string

    const res = await request
      .post("/personalBlog")
      .set("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU") // Use a valid test token
      .set("Content-Type", "multipart/form-data") // Set the content type to form data
      .field("blogData", jsonData) // Send the blogData as a field

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Please provide all fields");
  });
});


// Update personal blog test case
describe("PUT /updateBlog/:id", () => {
  test("should update an existing blog and return the updated blog data", async () => {
    const blogData = {
      title: "Updated Blog Post",
      author: "Dipak Pawar",
      blogContent: "This is the updated content of the blog post.",
    };

    const blogId = 186; // Use the ID of the blog you want to update

    const jsonData = JSON.stringify(blogData); // Convert the object to a JSON string

    const res = await request
      .put(`/updateBlog/${blogId}`)
      .set("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU") // Use a valid test token
      .set("Content-Type", "application/json") // Set the content type to JSON
      .field("blogData", jsonData) // Send the JSON string as 'blogData'
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Personal Blog Updated Successfully");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.title).toBe(blogData.title);
    expect(res.body.data.author).toBe(blogData.author);
    expect(res.body.data.blogContent).toBe(blogData.blogContent);
  });

  test("should return 404 if the blog does not exist", async () => {
    const blogData = {
      title: "Non-existent Blog Post",
      author: "Unknown Author",
      blogContent: "This blog does not exist.",
    };

    const blogId = 9999; // Use an ID that does not exist

    const jsonData = JSON.stringify(blogData); // Convert the object to a JSON string

    const res = await request
      .put(`/updateBlog/${blogId}`)
      .set("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcGFrQDEyM2dtYWlsLmNvbSIsImlhdCI6MTcyNzAxMzcwNSwiZXhwIjoxNzI3MTAwMTA1fQ.sQh7E-4JdBS40cZs5Zg2gUpb4zGFMDEQHRfDVy7O9TU") // Use a valid test token
      .set("Content-Type", "application/json") // Set the content type to JSON
      .field("blogData", jsonData) // Send the JSON string as 'blogData'
     
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Blog not found or no changes made");
  });
});
