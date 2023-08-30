const express = require("express");
const { ShelterModel } = require("../Models/Shelter.Model");
const ShelterRouter = express.Router();

ShelterRouter.get("/", async (req, res) => {
  try {
    const { type, sortBy, sortOrder, location, page, limit, search } = req.query;

    let query = {};

    if (type) {
      query.type = type.toLowerCase();
    }
    if (location) {
      query.location = location;
    }


    // Paginating data
    // const currentPage = parseInt(page) || 1;
    // const limitPerPage = parseInt(limit) || 10;
    // const startIndex = (currentPage - 1) * limitPerPage;
    // const endIndex = currentPage * limitPerPage;
    // const paginatedData = Shelters.slice(startIndex, endIndex);

    // res.status(200).json({
    //   data: paginatedData,
    //   totalData: Shelters.length,
    //   totalPages: Math.ceil(Shelters.length / limitPerPage),
    //   currentPage,
    // });


    let currentPage = 1;
    let sheltersPerPage = 8;

    if (page) {
      currentPage = +page;
    }

    const shelters = await ShelterModel.find(query)
      .skip((currentPage - 1) * sheltersPerPage)
      .limit(sheltersPerPage);

    res.status(200).json({
      shelters,
      totalData: await ShelterModel.countDocuments(query),
      totalPages: Math.ceil(await ShelterModel.countDocuments(query) / sheltersPerPage),
      currentPage,
    });


    const Shelters = await ShelterModel.find(query);

    // Sorting the Data
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      Shelters.sort((a, b) => (a[sortBy] > b[sortBy] ? order : -order));
    }

    // Searching Data
    if (search) {
      const searchQuery = search.toLowerCase();

      Shelters = Shelters.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchQuery) ||
          pet.type.toLowerCase().includes(searchQuery) ||
          pet.location.toLowerCase().includes(searchQuery) ||
          pet.price.includes(searchQuery)
      );
    }


  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
});

module.exports = {
  ShelterRouter,
};
