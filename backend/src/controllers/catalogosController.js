const getCatalogos = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Catalogs retrieved successfully.',
      data: {
        estado_civil: [
          'soltero',
          'casado',
          'unión libre',
          'separado',
          'divorciado',
          'viudo',
          'fallecido'
        ],
        nivel_preparacion: [
          'educación primaria',
          'bachillerato',
          'universitario',
          'licenciatura',
          'ingeniería',
          'maestría',
          'doctorado'
        ],
        entrevistadores: [
          'Carmen Alvarez',
          'Esther Garcia',
          'Glenys Estevez',
          'Rud Peña',
          'Luis Quezada',
          'Luis Reyes',
          'Laura Rodriguez',
          'Radelqui Santos',
          'Adelin De la Rosa',
          'Yariel Pichardo',
          'Daniela Vicente',
          'Julia Paulino'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCatalogos
};
