describe('Comporbar Ranking', () => {
  const API_URL = 'https://limpness-stress-front.ngrok-free.dev'
  const FRONTEND_URL = 'https://voltagameabp.netlify.app/frontend/index.html'
  
  it('Verifica que el ranking se puede abrir', () => {
    cy.visit(FRONTEND_URL)
    
    cy.intercept('GET', `${API_URL}/ranking`).as('getRanking')
    
    cy.get('#openRanking').click()
    cy.wait('@getRanking')
    
    cy.get('#rankingModal').should('be.visible')
    cy.get('#lista-ranking-real').should('exist')
  })
})