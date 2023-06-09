const express = require("express");
const hubsRouter = express.Router();
const {
  getAllHubs,
  createHub,
  getHubById,
  updateHub,
  deleteHub,
} = require("../db/hubs");

hubsRouter.get("/", async (req, res, next) => {
  try {
    const allHubs = await getAllHubs();
    const hubs = allHubs.filter((hub) => {
      return hub;
    });

    res.send(hubs);
    console.log(hubs, "HUBS LOG");
  } catch ({ location }) {
    next({ location });
  }
});

hubsRouter.post("/", async (req, res, next) => {
  const { location, latitude, longitude } = req.body;

  const hubData = {
    location,
    latitude, 
    longitude
  };
  console.log("HUB DATA: ", hubData)
  try {
    if (req.admin) {
      const hub = await createHub(hubData);
      if (hub) {
        res.send(hub);
      } else {
        next({ name: "hubCreationError", message: "Error creating hub." });
      }
    } else {
      res.sendStatus(401);
    }
  } catch ({ name, message }) {
    next({
      name,
      message: `An activity with name ${hubData.hub} already exists`,
    });
  }
});

hubsRouter.patch("/:hubId", async (req, res, next) => {
  try {
    if (req.admin) {
      const { hubId } = req.params;
      const getHubId = await getHubById(hubId);
      if (!getHubId) {
        next({
          name: "not found",
          message: `Hub ${hubId} not found`,
        });
      } else {
        const { location } = req.body;
        try {
          const updatedHub = await updateHub(location, hubId);
          res.send(updatedHub);
        } catch (error) {
          next({
            name: "",
            message: `An hub with location ${location} already exists`,
          });
          console.log(error);
        }
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
  }
});

hubsRouter.delete("/", async (req, res, next) => {
  const { id } = req.body;
  try {
    if (req.admin) {
      const deletedHub = await deleteHub(id);
      if (deletedHub) {
        res.status(200).json({ message: `Hub ${id} was deleted.` });
      } else {
        res.status(404).json({ message: `Hub ${id} could not be found` });
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
    next(error);
  }
});

module.exports = hubsRouter;
