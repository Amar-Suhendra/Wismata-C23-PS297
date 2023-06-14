const WisataModel = require('../models/wisataModel');
const Wisata = require('../models/wisataModel');
const db = require('../config/database');

const getAllWisata = async (req, res) => {
  try {
    const [data] = await WisataModel.getAllWisata();
    res.json({
      message: 'GET all wisata success',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    });
  }
};

const getWisata = async (req, res) => {
    const { idWisata } = req.params;
  
    try {
      const [wisata] = await Wisata.findById(idWisata);
  
      if (!wisata) {
        return res.status(404).json({ message: 'Wisata not found' });
      }
  
      const umkmQuery = `
        SELECT * FROM umkm1 WHERE idWisata = ${idWisata};
        SELECT * FROM umkm2 WHERE idWisata = ${idWisata};
        SELECT * FROM umkm3 WHERE idWisata = ${idWisata};
      `;
  
      db.query(umkmQuery, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        const [umkm1, umkm2, umkm3] = results;
  
        const data = {
          wisata,
          umkm1,
          umkm2,
          umkm3,
        };
  
        res.json(data);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
  getAllWisata,
  getWisata,
};