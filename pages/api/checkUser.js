import axios from "axios";

export default async function handler(req, res) {
  try {
    const data = await axios.get(
      "https://ege-micro-authentication.herokuapp.com/api/v1/authentication/checkLogin",
      { param: req.body.param },
      headers
    );
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}
