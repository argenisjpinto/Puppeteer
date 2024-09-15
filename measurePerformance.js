const puppeteer = require('puppeteer');

async function measurePerformance(url, user, password, login, loginBtn, nameUser, addCartBtn, cart, btnPlaceOrder, inputName, inputCoutry, inputCity, inputCredit, inputMonth, inputYear, btnPurchase, btnOk, traceLogin, tracePurchase) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    // Navega a la URL
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Inicia una nueva grabación del rendimiento
    await page.tracing.start({ path: traceLogin });

    // Verifica que el botón loginBtn ('#login2') esté visible
    await page.waitForSelector(login, { visible: true, timeout: 30000 });
    console.log('Botón de inicio de sesión (login2) encontrado');

    // Hacer clic en el botón login
    await page.click(login);

    // Espera explícita para que los campos de usuario y contraseña aparezcan
    await page.waitForSelector(user, { visible: true, timeout: 30000 });
    console.log('Campo de usuario visible');
    await page.waitForSelector(password, { visible: true, timeout: 30000 });
    console.log('Campo de contraseña visible');

    // Ingresa datos en los campos de formulario
    await page.type(user, 'ArgenisPintoTester');
    await page.type(password, 'abcdef');

    // Espera a que el botón de Login en el Modal sea visible
    await page.waitForSelector(loginBtn, { visible: true, timeout: 30000 });

    // Hacer clic en el botón de Login en el Modal
    await page.click(loginBtn);

    // Espera a que la página se cargue completamente después del inicio de sesión
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Espera a confirmar que el Nombre de Usuario sea visible
    await page.waitForSelector(nameUser, { visible: true, timeout: 30000 });
    console.log('Nombre de usuario visible después de iniciar sesión');
    
    // Detiene la grabación del rendimiento
    await page.tracing.stop();

    // Inicia una nueva grabación del rendimiento
    await page.tracing.start({ path: tracePurchase });

    // Usar xPath para hacer clic en el teléfono (Esto para elementos solo con xPath)
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
          const xpath = "//a[contains(text(),'Samsung galaxy s6')]";
          const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const node = result.singleNodeValue;
          if (node) {
            node.click();
            resolve();
          } else {
            reject(new Error('No se encontró el el item Samsung galaxy s6'));
          }
        });
      });
        console.log('Clic en el item Samsung galaxy s6 hecho');
   
    // Espera a que la página de confirmación se cargue
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Espera a que el botón Add to cart sea visible
    await page.waitForSelector(addCartBtn, { visible: true, timeout: 30000 });

    // Hacer clic en el botón de Add to cart
    await page.click(addCartBtn);

    // Intercepta el diálogo (prompt/alert/confirm) y lo cierra
    page.on('dialog', async dialog => {
        console.log('Dialog detected:', dialog.message());
        await dialog.dismiss();  // Cierra el diálogo
    });

    // Hacer clic en el carrito para proceder
    await page.click(cart);

    // Espera a que el botón Place Order sea visible
    await page.waitForSelector(btnPlaceOrder, { visible: true, timeout: 30000 });

    // Hacer clic en el botón de Place Order
    await page.click(btnPlaceOrder);

    // Espera a que el campo de nombre y apellido sea visible
    await page.waitForSelector(inputName, { visible: true, timeout: 30000 });

    // Rellenar los campos del formulario
    await page.type(inputName, 'Argenis Pinto');
    await page.type(inputCoutry, 'Argentina');
    await page.type(inputCity, 'Buenos Aires');
    await page.type(inputCredit, '123456789');
    await page.type(inputMonth, 'Septiembre');
    await page.type(inputYear, '2024');

    // Hacer clic en Purchase
    await page.click(btnPurchase);

    // Espera a que el botón de Ok sea visible
    await page.waitForSelector(btnOk, { visible: true, timeout: 30000 });

    // Hacer clic en el botón de Ok
    await page.click(btnOk);

    // Detiene la grabación del rendimiento
    await page.tracing.stop();

    console.log('Performance Login Page trace saved as ' + traceLogin);
    console.log('Performance Checkout Page trace saved as ' + tracePurchase);

  } catch (error) {
    console.error('Error measuring performance:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
// Llama a la función con los selectores parametrizados
measurePerformance(
  'https://www.demoblaze.com/',
  '#loginusername',
  '#loginpassword',
  '#login2',
  '[onclick="logIn()"]',
  '#nameofuser',
  '[onclick="addToCart(1)"]',
  '#cartur',
  '[data-target="#orderModal"]',
  '#name',
  '#country',
  '#city',
  '#card',
  '#month',
  '#year',
  '[onclick="purchaseOrder()"]',
  '.confirm.btn.btn-lg.btn-primary',
  'trace-login.json',
  'trace2-Purchase.json'
);