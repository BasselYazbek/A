// Footer.js
const Footer = () => {
  return (
    <footer>
      <div
        className="panel-footer custom-footer-background"
        style={{
          backgroundColor: '#3E2723', // Dark chocolate
          padding: '20px',
          color: '#F5F5DC', // Light beige
        }}
      >
        <div className="container">
          <div className="row">
            {/* Hours Section */}
            <section id="hours" className="col-sm-4 text-center">
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Hours</h5>
              <p>Everyday: 9:00 till 15:00</p>
              <hr className="visible-xs" />
            </section>

            {/* Address Section */}
            <section id="address" className="col-sm-4 text-center">
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Address</h5>
              <p>
                Baakleen, Mount Lebanon
                <br />
                Below Baakleen Cooperative
              </p>
              <hr className="visible-xs" />
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="col-sm-4 text-center">
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>About Us</h5>
              <p>
                Jaafar Trading Store – Your trusted wholesaler for chocolates, drinks, gums, and chocolate spreads. Delivering quality and value for over 9 years.
              </p>
              <p>
                متجر جعفر التجاري – موزعك الموثوق للحلويات، المشروبات، العلكة، ونشرات الشوكولاتة. نقدم الجودة والقيمة منذ أكثر من 9 سنوات.
              </p>
            </section>
          </div>
        </div>
      </div>
      <div
        className="text-center"
        style={{
          backgroundColor: '#8CC84B', // Vibrant green
          padding: '10px',
          color: '#3E2723', // Dark chocolate
          fontWeight: 'bold',
        }}
      >
        &copy; Copyright "Jaafar Trading" since 2024
      </div>
    </footer>
  );
};

export default Footer;
