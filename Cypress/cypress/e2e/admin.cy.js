describe('Panel de Administración', () => {
  const FRONTEND_URL = 'http://localhost:5500/frontend/index.html'

  beforeEach(() => {
    cy.visit(FRONTEND_URL)
  })

  it('Login como admin para acceder al panel de admin', () => {
    // Hacer el login 
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123.')
    cy.get('#form-login button[type="submit"]').click()
    
    // Para verificar redirección
    cy.wait(1600)
    cy.url().should('include', 'admin/admin.html')
    cy.contains('Usuarios').should('be.visible')
    cy.contains('Rankings').should('be.visible')
    cy.contains('Preguntas').should('be.visible')
  })

  it('Pestaña de los usuarios', () => {
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123')
    cy.get('#form-login button[type="submit"]').click()
    cy.wait(1600)

    cy.contains('Usuarios').click()

    cy.get('#lista-usuarios').should('be.visible')
    cy.get('#lista-usuarios tr').should('have.length.at.least', 1)
    cy.get('#lista-usuarios tr').first().should('contain', 'id')
      .or('contain', 'nombre')
  })

  it('Pestaña de Rankings', () => {
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123')
    cy.get('#form-login button[type="submit"]').click()
    cy.wait(1600)

    cy.contains('Rankings').click()
    
    cy.get('#lista-rankings').should('be.visible')
    cy.get('#lista-rankings li').should('have.length.at.least', 1)
    
    cy.get('#lista-rankings li').first().should('contain', 'pts')
  })

  it('Pstaña de Preguntas', () => {
    cy.get('#btn-abrir-modal').click()
    cy.get('#login-correo').type('danielIvina01@gmail.com')
    cy.get('#login-password').type('Admin123')
    cy.get('#form-login button[type="submit"]').click()
    cy.wait(1600)
    
    cy.contains('Preguntas').click()
    
    cy.get('#lista-preguntas').should('be.visible')
    cy.get('#lista-preguntas li').should('have.length.at.least', 1)
    
    cy.get('#lista-preguntas li').first().should('contain', '?')
  })
})