const client = require("./index");

const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUser,
  deactivateUser,
} = require("./users");
const { createCart, getCartByUserId, updateCartStatus } = require("./cart");
const {
  createCar,
  updateCar,
  getAllCars,
  getCarById,
  getCarsByHubLocation,
  deleteCar,
  deactivateCar,
} = require("./cars");
const {
  createHub,
  getAllHubs,
  getHubById,
  getHubByLocation,
  updateHub,
  deleteHub,
  deactivateHub,
} = require("./hubs");
const {
  createTag,
  updateTag,
  deactivateTag,
  deleteTag,
  getAllTags,
  getTagById,
} = require("./tags");
const {
  addTagToCar,
  removeTagFromCar,
  getTagsByCar,
  getCarsByTag,
} = require("./car-tags");
const {
  addCarToHubInventory,
  removeCarFromHubInventory,
  getInventoryByHubId,
} = require("./inventory");
const {
  addCarToCart,
  removeCarFromCart,
  updateCarQuantity,
  getCartItemsByCartId,
  clearCart,
} = require("./cart-items");
const { createAdmin } = require("./admin");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.connect();
    await client.query(`
      DROP TABLE IF EXISTS guest_cart_items;
      DROP TABLE IF EXISTS cart_items;
      DROP TABLE IF EXISTS cart;
      DROP TABLE IF EXISTS guest_cart;
      DROP TABLE IF EXISTS inventory;
      DROP TABLE IF EXISTS car_tags;
      DROP TABLE IF EXISTS hubs;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS cars;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS guests;
      DROP TABLE IF EXISTS admins;
      `);
    console.log("Finished dropping tables!");
    await client.release();
  } catch (error) {
    console.log("Error when dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    await client.connect();
    console.log("Starting to build tables...");
    await client.query(`
      CREATE TABLE admins(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) UNIQUE NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        "isAdmin" BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE users(
        id SERIAL PRIMARY KEY UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        location VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE guests(
        id SERIAL PRIMARY KEY UNIQUE,
        name VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE guest_cart(
        id SERIAL PRIMARY KEY UNIQUE,
        "guestId"  INTEGER REFERENCES guests(id) ON DELETE CASCADE,
        "isOrdered" BOOLEAN DEFAULT false
      );
      

      CREATE TABLE cars(
        id SERIAL PRIMARY KEY UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        daily_rate INTEGER NOT NULL,
        "hubLocation" VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE tags(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE car_tags(
        id SERIAL PRIMARY KEY,
        "carId" INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE("carId", "tagId")
      );
      
      CREATE TABLE hubs(
        id SERIAL PRIMARY KEY,
        location VARCHAR(255) UNIQUE NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE inventory(
        id SERIAL PRIMARY KEY,
        "hubId" INTEGER REFERENCES hubs(id) ON DELETE CASCADE,
        "carId" INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        UNIQUE("carId", "hubId")
      );
      
      CREATE TABLE cart(
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "isOrdered" BOOLEAN DEFAULT false
      );
      
      CREATE TABLE cart_items(
        id SERIAL PRIMARY KEY,
        "cartId" INTEGER REFERENCES cart(id) ON DELETE CASCADE,
        "carId" INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        price INTEGER,
        quantity INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE guest_cart_items(
        id SERIAL PRIMARY KEY UNIQUE,
        "guestCartId" INTEGER REFERENCES guest_cart(id) ON DELETE CASCADE,
        "carId" INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        price INTEGER,
        quantity INTEGER NOT NULL DEFAULT 1
      );
      
      `);
    console.log("Finished building tables!");
    client.release();
  } catch (error) {
    console.log("Error when building tables!");
    throw error;
  }
}
async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99", email: "albert@gmail.com" },
      { username: "sandra", password: "sandra123", email: "sandra@gmail.com" },
      {
        username: "glamgal",
        password: "glamgal123",
        email: "glamgal@gmail.com",
      },
    ];
    //const users = await Promise.all(usersToCreate.map(createUser));
    const users = [];
    for (let i = 0; i < usersToCreate.length; i++) {
      users.push(await createUser(usersToCreate[i]));
    }
    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createAdminUsers()
{
  console.log("Starting to create admin users...")
  const userToCreate = [
    {username:"carter", password:"password"}
  ]
  try
  {
      const users = [];
      for(let i = 0; i < userToCreate.length; i++)
      {
        users.push(await createAdmin(userToCreate[i]));
      }
    }
    catch(error)
    {
      console.error("Error creating admin users");
      throw error;
    }
}

async function createInitialHubs() {
  console.log("Starting to create hubs...");
  try {
    const hubsToCreate = [
      { id: 1, location: "Arizona" },
      { id: 2, location: "Nevada" },
      { id: 3, location: "Texas" },
      { id: 4, location: "Colorado" },
    ];
    //const hubs = await Promise.all(hubsToCreate.map(createHub));
    const hubs = [];

    for (let i = 0; i < hubsToCreate.length; i++) {
      hubs.push(await createHub(hubsToCreate[i]));
    }

    console.log("Hubs created:");
    console.log(hubs);
    console.log("Finished creating hubs!");
  } catch (error) {
    console.error("Error creating hubs!");
    throw error;
  }
}

async function createInitialTags() {
  console.log("Starting to create tags...");
  try {
    const tagsToCreate = [
      "Truck",
      "Sedan",
      "Coupe",
      "Van",
      "Minivan",
      "Hatchback",
      "SUV",
      "Convertible",
      "Luxury",
      "Electric",
      "Gas",
      "Hybrid",
      "Dummy Data",
    ];
    //const tags = await Promise.all(tagsToCreate.map(createTags));
    const tags = [];

    for (let i = 0; i < tagsToCreate.length; i++) {
      tags.push(await createTag(tagsToCreate[i]));
    }

    console.log("Tags created:");
    console.log(tags);
    console.log("Finished creating tags!");
  } catch (error) {
    console.error("Error creating tags!");
    throw error;
  }
}

async function createInitialVehicles() {
  console.log("Starting to create vehicles...");
  try {
    const vehiclesToCreate = [
      {
        name: "Ford Focus",
        description: "high-mpg sedan",
        daily_rate: 100,
        hubLocation: "Nevada",
      },
      {
        name: "Toyota Camry",
        description: "high-mpg sedan",
        daily_rate: 100,
        hubLocation: "Arizona",
      },
      {
        name: "Honda Civic",
        description: "high-mpg sedan",
        daily_rate: 100,
        hubLocation: "Texas",
      },
      {
        name: "Chevrolet Silverado",
        description: "powerful truck",
        daily_rate: 150,
        hubLocation: "Nevada",
      },
      {
        name: "Ford F-150",
        description: "powerful truck",
        daily_rate: 150,
        hubLocation: "Colorado",
      },
      {
        name: "Ram 1500",
        description: "powerful truck",
        daily_rate: 150,
        hubLocation: "Arizona",
      },
      {
        name: "Jeep Wrangler",
        description: "off-road SUV",
        daily_rate: 200,
        hubLocation: "Nevada",
      },
      {
        name: "Toyota 4Runner",
        description: "off-road SUV",
        daily_rate: 200,
        hubLocation: "Colorado",
      },
      {
        name: "Chevrolet Tahoe",
        description: "family SUV",
        daily_rate: 175,
        hubLocation: "Texas",
      },
      {
        name: "Tesla Model S",
        description: "luxury electric sedan",
        daily_rate: 400,
        hubLocation: "Nevada",
      },
      {
        name: "BMW 7 Series",
        description: "luxury sedan",
        daily_rate: 350,
        hubLocation: "Colorado",
      },
      {
        name: "Mercedes-Benz S-Class",
        description: "luxury sedan",
        daily_rate: 350,
        hubLocation: "Texas",
      },
      {
        name: "Mercedes-Benz GLS",
        description: "luxury SUV",
        daily_rate: 400,
        hubLocation: "Nevada",
      },
      {
        name: "Range Rover",
        description: "luxury SUV",
        daily_rate: 400,
        hubLocation: "Colorado",
      },
      {
        name: "Lamborghini Urus",
        description: "luxury SUV",
        daily_rate: 500,
        hubLocation: "Texas",
      },
    ];
    //const vehicles = await Promise.all(vehiclesToCreate.map(createCar));

    const vehicles = [];

    for (let i = 0; i < vehiclesToCreate.length; i++) {
      vehicles.push(await createCar(vehiclesToCreate[i]));
    }

    console.log("Vehicles created:");
    console.log(vehicles);
    console.log("Finished creating vehicles!");
  } catch (error) {
    console.error("Error creating vehicles!");
    throw error;
  }
}

async function createInitialCart() {
  console.log("Creating initial cart");
  try {
    const cartToCreate = [1, 2];
    const carts = [];

    for (let i = 0; i < cartToCreate.length; i++) {
      carts.push(await createCart(cartToCreate[i]));
    }
    console.log("Carts created:");
    console.log(carts);
    console.log("Finished creating carts!");
  } catch (error) {
    console.log(error);
  }
}

async function createInitialCartItems(cartId) {
  console.log("Creating initial cart items");
  try {
    const cartItemsToCreate = [
      { carId: 1, price: 1000, quantity: 2 },
      { carId: 2, price: 1500, quantity: 1 },
      { carId: 3, price: 2000, quantity: 3 },
    ];
    const cartItems = [];

    for (let i = 0; i < cartItemsToCreate.length; i++) {
      const { carId, price, quantity } = cartItemsToCreate[i];
      cartItems.push(await addCarToCart(carId, cartId, price, quantity));
    }
    console.log("Cart items created:");
    console.log(cartItems);
    console.log("Finished creating cart items!");
  } catch (error) {
    console.log(error);
  }
}

async function testTagsDB() {
  console.log("testing Tags for DB");
  try {
    console.log("/////////////////TESTING TAGS/////////////////");
    const createdTag = await createTag("Luxury Sports Car");
    console.log("CREATED TAG", createdTag);
    const updatedTag = await updateTag({
      tagId: 13,
      name: "Testing Testing",
    });
    console.log("UPDATE TAGS", updatedTag);
    const tags = await getAllTags();
    console.log("GOT ALL TAGS", tags);
    const getTagId = await getTagById(8);
    console.log("GETTING TAG BY ID", getTagId);
    const deactivatedTag = await deactivateTag(6);
    console.log(`DEACTIVATED ${deactivatedTag} TAG(S)`);
    const deletedTag = await deleteTag(13);
    console.log(`DELETED ${deletedTag}`);
  } catch {
    console.error(error);
  }
}

async function testUserDB() {
  console.log(
    "////////////////////////////////////////////testing users////////////////////////////////////////////"
  );
  try {
    const newUser = await createUser({
      username: "John",
      password: "Johhny123",
      email: "john@gmail.com",
    });
    console.log("NEW USER LOG", newUser);
    const user = await getUser({ username: "sandra", password: "sandra123" });
    console.log("GET USER LOG", user);
    const userByID = await getUserById(2);
    console.log("USER BY ID", userByID);
    const userByEmail = await getUserByEmail("glamgal@gmail.com");
    console.log("USER BY EMAIL", userByEmail);
    const updatedUser = await updateUser({
      userId: 1,
      email: "newemail@example.com",
      location: "New York",
      active: false,
      username: "newusername",
      password: "newpassword",
    });

    console.log("UPDATED USER LOG", updatedUser);
    const deletedUser = await deleteUser(1);
    console.log(`Deleted ${deletedUser} user(s)`);
    const deactivatedUser = await deactivateUser(3);
    console.log(`Deactivated ${deactivatedUser} user(s)`);
  } catch (error) {}
}

async function testHubDB() {
  console.log(
    "////////////////////////////////////////////testing hubs////////////////////////////////////////////"
  );
  console.log("Calling create hub");
  const hub = await createHub({ location: "New York" });
  console.log("Result:", hub);
  console.log("Calling get all hub");
  const allHubs = await getAllHubs();
  console.log("Result:", allHubs);
  const hubById = await getHubById(1);
  console.log("Hub ID LOG:", hubById);
  const hubLocation = await getHubByLocation("Nevada");
  console.log("HUB LOCATION RESULT:", hubLocation);
  const updatedHub = await updateHub(1, "Kansas");
  console.log("UPDATED HUB LOG:", updatedHub);
  const deletedRowCount = await deleteHub(1);
  console.log(`Deleted ${deletedRowCount} hub(s)`);
  const deactivatedHub = await deactivateHub(3);
  console.log(`deactivated ${deactivatedHub} hub(s)`);

  console.log("Finish testing Hub Database Functions");
}

async function testCarDB() {
  try {
    console.log(
      "//////////////////////////////////////////// testing cars ////////////////////////////////////////////"
    );
    const newCar = await createCar({
      name: "Honda Civic",
      description: "Sedan",
      daily_rate: 80,
      hubLocation: "Nevada",
    });
    console.log(newCar);
    const updatedCar = await updateCar({
      carId: 1,
      name: "Ford Raptor",
      description: "Truck",
      daily_rate: 200,
      hubLocation: "Texas",
    });
    console.log(updatedCar, "UPDATED CAR RESULT");
    const allCars = await getAllCars();
    console.log(allCars, "ALL CARS RESULTS");
    const carByID = await getCarById(3);
    console.log(carByID, "CAR BY ID RESULTS");
    const carByHUB = await getCarsByHubLocation(2);
    console.log(carByHUB, "CAR BY HUB RESULTS");
    const deletedCar = await deleteCar(1);
    console.log(deletedCar, "DELETED CAR RESULTS");
    const deactivatedCar = await deactivateCar(2);
    console.log(deactivatedCar, "DEACTIVATED CAR RESULTS");
  } catch (error) {
    console.log(error);
  }
}

async function testCarTagsDB() {
  console.log(
    "//////////////////////////////////////////// testing car-tags ////////////////////////////////////////////"
  );
  try {
    console.log("Calling addTagToCar(1, 1)");
    const tag1 = await addTagToCar(2, 1);
    const tag2 = await addTagToCar(2, 2);
    const tag3 = await addTagToCar(2, 3);
    console.log("addTagToCar(1, 1) Result:", tag1);
    console.log("addTagToCar(1, 2) Result:", tag2);
    console.log("addTagToCar(1, 3) Result:", tag3);

    console.log("calling removeTagFromCar(1,1)");
    const removedTag = await removeTagFromCar(1, 1);
    console.log("removeTagFromCar() Result: ", removedTag);

    console.log("calling getTagsByCar(1)");
    const tags = await getTagsByCar(1);
    console.log("getTagsByCar(1) Result: ", tags);

    console.log("calling getCarsByTag(1)");
    const cars = await getCarsByTag(1);
    console.log("getCarsByTag(1) Result: ", cars);

    console.log("finished testing database");
  } catch (error) {}
}

async function testCartDB() {
  const newCart1 = await createCart(2);
  const newCart2 = await createCart(3);
  console.log("NEW CART RESULT", newCart1);
  console.log("NEW CART2 RESULT", newCart2);
  const cartByID = await getCartByUserId(2);
  console.log("CART BY ID RESULT", cartByID);
  const updatedCart = await updateCartStatus(2);
  console.log("CART STATUS RESULT", updatedCart);
}
async function testInventoryDB() {
  console.log(
    "////////////////////////////////////////////testing inventory////////////////////////////////////////////"
  );

  console.log("calling addCarToHubInventory(3, 4)");
  const car1 = await addCarToHubInventory(3, 4);
  const car2 = await addCarToHubInventory(8, 4);
  const car3 = await addCarToHubInventory(6, 4);
  console.log("addCarToHubInventory(3) Result: ", car1);
  console.log("addCarToHubInventory(8) Result: ", car2);
  console.log("addCarToHubInventory(6) Result: ", car3);

  // console.log("calling removeCarFromHubInventory(3, 4)");
  // const removedCar = await removeCarFromHubInventory(3, 4);
  // console.log("removeCarFromHubInventory() Result: ", removedCar);

  console.log("calling getInventoryByHubId()");
  const inventory = await getInventoryByHubId(4);
  console.log("getInventoryByHubId() Result: ", inventory);

  console.log(
    "////////////////////////////////////////////finished testing inventory////////////////////////////////////////////"
  );
}

async function testCartItemsDB() {
  console.log(
    "////////////////////////////////////////////testing cart-items////////////////////////////////////////////"
  );
  const carToCart1 = await addCarToCart(3, 2, 1000);
  const carToCart2 = await addCarToCart(4, 2, 3000);
  const carToCart3 = await addCarToCart(5, 2, 5000);
  console.log(carToCart1, "CART TEST RESULT");
  console.log(carToCart2, "CART TEST RESULT2");
  console.log(carToCart3, "CART TEST RESULT3");

  const removedCar = await removeCarFromCart(3, 2);
  console.log(removedCar, "REMOVED RESULT");

  const updatedCar = await updateCarQuantity(4, 2, 3);
  console.log(updatedCar, "UPDATED CAR RESULT");

  const getItems = await getCartItemsByCartId(2);
  console.log(getItems, "GET CART ITEMS RESULT");

  const clearedCart = await clearCart(2);
  console.log(clearedCart, "TEST RESULTS");
}

async function testDB() {

  await testHubDB();
  await testCarDB();

  await testTagsDB();


  await testUserDB();
  await testHubDB();
  await testCarDB();
  await testCarTagsDB();
  await testCartDB();
  await testInventoryDB();
  await testCartItemsDB();
}

async function rebuildDB() {
  await dropTables();
  await createTables();
  await createInitialUsers();
  await createAdminUsers();
  await createInitialVehicles();
  await createInitialTags();
  await createInitialHubs();
  await createInitialCart();
  await createInitialCartItems(1);
  await testDB();
  return;
}

rebuildDB();

