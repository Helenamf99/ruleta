describe('Panel de Administración', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('already been declared')) {
      return false  
    }
    return true
  })

  const FRONTEND_URL = 'https://voltagameabp.netlify.app/frontend/index.html'

  beforeEach(() => {
    cy.visit(FRONTEND_URL)
  })

  it('Login como admin para acceder al panel de admin', () => {
    // Hacer el login 
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123.')
    cy.get('#form-login button[type="submit"]').click()
    
    // Verificar redirección
    cy.wait(2000)
    cy.url().should('include', 'admin/admin.html')
    cy.wait(1000)
    
    // Verificar que las pestañas están visibles
    cy.contains('Usuarios').should('be.visible')
    cy.contains('Rankings').should('be.visible')
    cy.contains('Preguntas').should('be.visible')
  })

  it('Pestaña de los usuarios', () => {
    // Login
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123.')
    cy.get('#form-login button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', 'admin/admin.html')
    cy.wait(1000)

    // Ir a pestaña Usuarios
    cy.contains('Usuarios').click()
    cy.wait(1000)

    // Verificaciones
    cy.get('#lista-usuarios').should('be.visible')
    cy.get('#lista-usuarios tr').should('have.length.at.least', 1)
  })

  it('Pestaña de Rankings', () => {
    // Login
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123.')
    cy.get('#form-login button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', 'admin/admin.html')
    cy.wait(1000)

    // Ir a pestaña Rankings
    cy.contains('Rankings').click()
    cy.wait(1000)
    
    // Verificaciones
    cy.get('#lista-rankings').should('be.visible')
    cy.get('#lista-rankings li').should('have.length.at.least', 1)
  })

  it('Pestaña de Preguntas', () => {
    // Login
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123.')
    cy.get('#form-login button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', 'admin/admin.html')
    cy.wait(1000)
    
    // Ir a pestaña Preguntas
    cy.contains('Preguntas').click()
    cy.wait(1000)
    
    // Verificaciones
    cy.get('#lista-preguntas').should('be.visible')
    cy.get('#lista-preguntas li').should('have.length.at.least', 1)
  })
})