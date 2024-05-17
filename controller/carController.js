const { cars } = require("../models");
const fs = require("fs");
const path = require("path");

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
      const car = await cars.findByPk(id);
      const existingImage = car.image;
      const newImage = req.file
        ? `/upload/${req.file.filename}`
        : existingImage;

      // Hapus gambar lama jika ada gambar baru
      if (req.file && existingImage) {
        const oldImagePath = path.join(__dirname, "../public", existingImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          }
        });
      }

      await cars.update(
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

      res.status(200).json({ message: "Data berhasil diperbarui" });
    } catch (err) {
      res.status(400).json({ message: "Gagal memperbarui data", error: err });
    }
  }

  // Delete cars
  static async deleteCars(req, res, next) {
    const id = req.params.id;
    try {
      const car = await cars.findByPk(id);
      if (car) {
        const imagePath = path.join(__dirname, "../public", car.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
        await cars.destroy({ where: { id: id } });
        res.redirect("/");
      } else {
        res.status(400).json({ message: "Data not found!" });
      }
    } catch (err) {
      res.status(400).json({ message: "Failed to delete image", error: err });
    }
  }
}

module.exports = CarController;
