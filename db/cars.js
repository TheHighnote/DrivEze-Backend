const { client } = require("./index");

async function createCar({ name, description, price, hubLocation }) {
  try {
    console.log(`Creating new car: ${name}...`);
    const { rows } = await client.query(
      `
      INSERT INTO cars(name, description, price, "hubLocation")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [name, description, price, hubLocation]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function getCarById(carId) {
  try {
    console.log(`Getting car with ID ${carId}...`);
    const { rows } = await client.query(
      `
      SELECT *
      FROM cars
      WHERE id=$1;
    `,
      [carId]
    );

    if (rows.length) {
      return rows[0];
    }

    throw new Error(`No car with ID ${carId} found.`);
  } catch (error) {
    console.error(error);
  }
}

async function getAllCars() {
  try {
    console.log("Getting all cars...");
    const { rows } = await client.query(`
      SELECT *
      FROM cars;
    `);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function updateCar(carId, fieldsToUpdate) {
  try {
    console.log(`Updating car with ID ${carId}...`);
    const { name, description, price, hubLocation, active } = fieldsToUpdate;

    const updateFields = [];
    const params = [];

    if (name) {
      updateFields.push(`name=$${updateFields.length + 1}`);
      params.push(name);
    }

    if (description) {
      updateFields.push(`description=$${updateFields.length + 1}`);
      params.push(description);
    }

    if (price) {
      updateFields.push(`price=$${updateFields.length + 1}`);
      params.push(price);
    }

    if (hubLocation) {
      updateFields.push(`"hubLocation"=$${updateFields.length + 1}`);
      params.push(hubLocation);
    }

    if (active !== undefined) {
      updateFields.push(`active=$${updateFields.length + 1}`);
      params.push(active);
    }

    const { rows } = await client.query(
      `
      UPDATE cars
      SET ${updateFields.join(", ")}
      WHERE id=$${params.length + 1}
      RETURNING *;
    `,
      [...params, carId]
    );

    if (rows.length) {
      return rows[0];
    }

    throw new Error(`No car with ID ${carId} found.`);
  } catch (error) {
    console.error(error);
  }
}

async function deleteCar(carId) {
  try {
    console.log(`Deleting car with ID ${carId}...`);
    const { rows } = await client.query(
      `
      DELETE FROM cars
      WHERE id=$1
      RETURNING *;
    `,
      [carId]
    );

    if (rows.length) {
      return rows[0];
    }

    throw new Error(`No car with ID ${carId} found.`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createCar,
  getCarById,
  getAllCars,
  updateCar,
  deleteCar,
};