const { cars } = require("../models");

class CarController {
  // Add cars
  static async addCars(req, res, next) {
    try {
      await cars.create({
        name: req.body.name,
        rentPrice: req.body.rentPrice,
        type: req.body.type,
        image: `/upload/${req.file.filename}`,
      });
      res.status(200).json({ message: "Data berhasil ditambahkan" });
    } catch (err) {
      res.status(400).json({ message: "Gagal menambahkan data", error: err });
    }
  }

  // Get all cars
  static async getAllCars(req, res, next) {
    try {
      const result = await cars.findAll();
      res.render("cars/index", { ListCars: result, url: "/", title: "" });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // Edit cars
  static async editCars(req, res, next) {
    const id = req.params.id;
    try {
      const result = await cars.findByPk(id);
      res.render("cars/updateCar", {
        data: result,
        url: req.url,
        title: "Update Car",
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // Update cars
  static async updateCars(req, res, next) {
    const id = req.params.id;
    try {
      const existingImage = req.body.existingImage;
      const newImage = req.file
        ? `/upload/${req.file.filename}`
        : existingImage;

      const result = await cars.update(
        {
          name: req.body.name,
          rentPrice: req.body.rentPrice,
          type: req.body.type,
          image: newImage,
        },
        {
          where: { id: id },
        }
      );

      if (result == 1) {
        res.status(200).json({ message: "Data berhasil diperbarui" });
      } else {
        res.status(400).json({ message: "Gagal memperbarui data" });
      }
    } catch (err) {
      res.status(400).json({ message: "Gagal memperbarui data", error: err });
    }
  }

  // Delete cars
  static async deleteCars(req, res, next) {
    const id = req.params.id;
    try {
      const result = await cars.destroy({ where: { id: id } });
      if (result == 1) {
        res.redirect("/");
      } else {
        res.send({ message: `cannot delete id=${id}` });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

module.exports = CarController;
