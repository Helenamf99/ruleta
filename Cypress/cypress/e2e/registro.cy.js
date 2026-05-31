describe('Comprobar Registro y Login ', () => {
  const API_URL = 'https://limpness-stress-front.ngrok-free.dev'
  const FRONTEND_URL = 'http://localhost:5500/frontend/index.html'

  it('Registro manual ', () => {
    cy.visit(FRONTEND_URL)
    
    // Abrir modal
    cy.get('#btn-abrir-modal').click()
    cy.contains('Regístrate aquí').click()

    cy.pause()

    cy.intercept('POST', `${API_URL}/registro`).as('registro')
    
    cy.get('#form-registro button[type="submit"]').click()
    
    cy.wait('@registro').then((interception) => {
      if (interception.response.statusCode === 201) {
        cy.log('Registro con éxito!')
      } else {
        cy.log('Error en el registro:', interception.response.body)
      }
    })
  })

  it('Login manual ', () => {
    cy.visit(FRONTEND_URL)
    
    // Abrir modal
    cy.get('#btn-abrir-modal').click()
   
    cy.pause()
    
    cy.intercept('POST', `${API_URL}/login`).as('login')
    cy.get('#form-login button[type="submit"]').click()
    
    cy.wait('@login').then((interception) => {
      if (interception.response.statusCode === 200) {
        cy.log('Login con éxito')
        cy.log(`Bienvenido: ${interception.response.body.username}`)
      } else {
        cy.log('Error en login:', interception.response.body)
      }
    })
  })
})