describe('Mi Registro y Login - Automático', () => {
  const API_URL = 'https://limpness-stress-front.ngrok-free.dev'
  const FRONTEND_URL = 'https://voltagameabp.netlify.app/frontend/index.html'

  const misDatos = {
    nombre: 'gonzalo',
    email: 'gonzalo@campus.monlau.com',
    password: 'Gonzalo123.'  
  }

  beforeEach(() => {
    cy.visit(FRONTEND_URL)
    cy.clearLocalStorage()
  })

  it('Registrarme (si no existía)', () => {
    cy.get('#btn-abrir-modal').click()
    cy.contains('Regístrate aquí').click()
    
    cy.get('#reg-usuario').type(misDatos.nombre)
    cy.get('#reg-correo').type(misDatos.email)
    cy.get('#reg-password').type(misDatos.password)
    
    cy.intercept('POST', `${API_URL}/registro`).as('registro')
    cy.get('#form-registro button[type="submit"]').click()
    
    cy.wait('@registro', { timeout: 5000 }).then((interception) => {
      if (interception.response.statusCode === 201) {
        cy.log(' Registro con éxito')
      } else {
        cy.log('Usuario ya existe:', interception.response.statusCode)
      }
    })
  })

  it('Iniciar sesión', () => {
    cy.get('#btn-abrir-modal').click()
    
    cy.get('#login-correo').type(misDatos.email)
    cy.get('#login-password').type(misDatos.password)
    
    cy.intercept('POST', `${API_URL}/login`).as('login')
    cy.get('#form-login button[type="submit"]').click()
    
    cy.wait('@login', { timeout: 5000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      cy.log(` Login con exito: ${interception.response.body.username}`)
    })
    
    cy.get('#btn-abrir-modal').should('have.text', '¡Iniciar Juego!')
    cy.get('#btn-abrir-modal').should('have.attr', 'data-logged', 'true')
  })
})