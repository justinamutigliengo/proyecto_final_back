import { Router } from "express";
import config from "../config.js";

const router = Router();

const adminAuth = (req, res, next) => {
  if (req.session.user.role !== "admin")
    return res.status(403).send({
      origin: config.SERVER,
      payload: "Acceso no autorizado: se requiere nivel de admin",
    });

  next();
};

router.get("/counter", async (req, res) => {
  try {
    if (req.session.counter) {
      req.session.counter++;
      res.status(200).send({
        origin: config.SERVER,
        payload: `Visitas: ${req.session.counter}`,
      });
    } else {
      req.session.counter = 1;
      res.status(200).send({
        origin: config.SERVER,
        payload: "Bienvenido, es tu primer visita!",
      });
    }
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Esto simula datos ingresados desde un formulario
    // const email = "idux.net@gmail.com";
    // const password = "abc123";

    const { email, password } = req.body;

    // Esto simula datos existentes en base de datos
    const savedFirstName = "José";
    const savedLastName = "Perez";
    const savedEmail = "idux.net@gmail.com";
    const savedPassword = "abc123";
    const savedRole = "admin";

    if (email !== savedEmail || password !== savedPassword) {
      return res
        .status(401)
        .send({ origin: config.SERVER, payload: "Datos de acceso no válidos" });
    }

    req.session.user = {
      firstName: savedFirstName,
      lastName: savedLastName,
      email: email,
      role: savedRole,
    };
    // res.status(200).send({ origin: config.SERVER, payload: "Bienvenido!" });
    // res.redirect nos permite redireccionar a una plantilla en lugar de devolver un mensaje
    res.redirect("/profile");
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

router.get("/private", adminAuth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ origin: config.SERVER, payload: "Bienvenido ADMIN!" });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

// Limpiamos los datos de sesión
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err)
        return res.status(500).send({
          origin: config.SERVER,
          payload: "Error al ejecutar logout",
          error: err,
        });
      //   res.status(200).send({ origin: config.SERVER, payload: "Usuario desconectado" });
      res.redirect("/login");
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

export default router;
