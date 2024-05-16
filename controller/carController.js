const { cars } = require("../models");

class CarController {
  // Add cars
  static async addCars(req, res, next) {
    let errors = [];
    if (errors.length > 0) {
      res.render("cars/createCar", {
        errors,
        url: req.url,
        title: "Add New Car",
      });
    } else {
      try {
        const result = await cars.create({
          name: req.body.name,
          rentPrice: req.body.rentPrice,
          type: req.body.type,
          image: `/upload/${req.file.filename}`,
        });
        errors.push({ msg: "Data berhasil ditambahkan" });
        res.render("cars/createCar", {
          errors,
          result,
          url: req.url,
          title: "Add New Car",
        });
      } catch (err) {
        res.status(400).send(err);
      }
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
    let errors = [];
    try {
      const result = await cars.update(
        {
          name: req.body.name,
          rentPrice: req.body.rentPrice,
          type: req.body.type,
          image: `/upload/${req.file.filename}`,
        },
        {
          where: { id: id },
        }
      );
      if (result == 1) {
        errors.push({ msg: "Data berhasil terupdate" });
        res.render("cars/updateCar", {
          errors,
          data: req.body,
          title: "Update Car",
          url: req.url,
        });
      } else {
        res.redirect(`${id}`);
        errors.push({ msg: "Data gagal terupdate" });
      }
    } catch (err) {
      res.status(400).send(err);
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
