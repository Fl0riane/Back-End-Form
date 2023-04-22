require("dotenv").config();

const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

/* MAILGUN CONFIGURATION */
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Floriane",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  res.status(200).json("Welcome");
});

app.post("/form", async (req, res) => {
  // console.log(req.body);
  try {
    const { firstname, lastname, email, message } = req.body;

    //   On crée un objet messageData qui contient des informations concernant le mail (qui m'envoie le mail, adresse vers laquelle je veux envoyer le mail, titre et contenu du mail) :
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "floriane.pelissier@live.fr",
      subject: `Formulaire JS`,
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    ); /* VOTRE NOM DE DOMAINE SE TERMINANT PAR `.mailgun.org` */

    res.status(200).json({ message: "email sent" });
    console.log(response);
  } catch (error) {
    res.status(error.status).json({ message: "email not sent" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("server is listening");
});
