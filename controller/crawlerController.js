
exports.getHome = (seed) => {
    return (req, res, next) => {
        return res.render('home.ejs', { heading: 'PDF Crawler', pdfs: seed });
      };
 
}