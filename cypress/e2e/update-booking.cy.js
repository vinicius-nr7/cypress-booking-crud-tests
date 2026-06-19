/// <reference types="cypress"/>

describe('Booking CRUD - Arquitetura Independente', () => {
    let token = ''

    before('Login', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                "username": "admin",
                "password": "password123"
            }
        }).then((response) => {
            token = response.body.token
        })
    })

    // CREATE + UPDATE (PUT)
    it('Update Booking - Sucesso', () => {
        cy.request('POST', 'https://restful-booker.herokuapp.com/booking', {
            "firstname": "Vinicius",
            "lastname": "Rodrigues",
            "totalprice": 1000,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2026-06-10",
                "checkout": "2026-06-15"
            },
            "additionalneeds": "Dinner"
        }).then((createResponse) => {
            const bookingId = createResponse.body.bookingid

            cy.request({
                method: 'PUT',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                body: {
                    "firstname": "Nome Alterado",
                    "lastname": "Sobrenome Rodrigues",
                    "totalprice": 6000,
                    "depositpaid": true,
                    "bookingdates": {
                        "checkin": "2026-06-10",
                        "checkout": "2026-06-20"
                    },
                    "additionalneeds": "Breakfast"
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': 'token=' + token
                }
            }).then((updateResponse) => {
                expect(updateResponse.status).to.eq(200)
                expect(updateResponse.body.firstname).to.eq("Nome Alterado")
                expect(updateResponse.body.lastname).to.eq("Sobrenome Rodrigues")
                expect(updateResponse.body.totalprice).to.eq(6000)
                expect(updateResponse.body.depositpaid).to.eq(true)
                expect(updateResponse.body.bookingdates.checkin).to.eq("2026-06-10")
                expect(updateResponse.body.bookingdates.checkout).to.eq("2026-06-20")
                expect(updateResponse.body.additionalneeds).to.eq("Breakfast")
            })
        })
    })

    // UPDATE parcial (PATCH)
    it('Update Booking - PATCH apenas firstname', () => {
        cy.request('POST', 'https://restful-booker.herokuapp.com/booking', {
            "firstname": "Vinicius",
            "lastname": "Rodrigues",
            "totalprice": 1000,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2026-06-10",
                "checkout": "2026-06-15"
            },
            "additionalneeds": "Dinner"
        }).then((createResponse) => {
            const bookingId = createResponse.body.bookingid

            cy.request({
                method: 'PATCH',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                body: {
                    "firstname": "Alterado PATCH"
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': 'token=' + token
                }
            }).then((patchResponse) => {
                expect(patchResponse.status).to.eq(200)
                expect(patchResponse.body.firstname).to.eq("Alterado PATCH")
                expect(patchResponse.body.lastname).to.eq("Rodrigues")
                expect(patchResponse.body.totalprice).to.eq(1000)
                expect(patchResponse.body.depositpaid).to.eq(true)
                expect(patchResponse.body.bookingdates.checkin).to.eq("2026-06-10")
                expect(patchResponse.body.bookingdates.checkout).to.eq("2026-06-15")
                expect(patchResponse.body.additionalneeds).to.eq("Dinner")
            })
        })
    })

    // READ (GET)
    it('Get Booking - Sucesso', () => {
        cy.request('POST', 'https://restful-booker.herokuapp.com/booking', {
            "firstname": "Vinicius",
            "lastname": "Rodrigues",
            "totalprice": 1500,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2026-07-01",
                "checkout": "2026-07-10"
            },
            "additionalneeds": "Lunch"
        }).then((createResponse) => {
            const bookingId = createResponse.body.bookingid

            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(200)
                expect(getResponse.body.firstname).to.eq("Vinicius")
                expect(getResponse.body.lastname).to.eq("Rodrigues")
                expect(getResponse.body.totalprice).to.eq(1500)
                expect(getResponse.body.depositpaid).to.eq(true)
                expect(getResponse.body.bookingdates.checkin).to.eq("2026-07-01")
                expect(getResponse.body.bookingdates.checkout).to.eq("2026-07-10")
                expect(getResponse.body.additionalneeds).to.eq("Lunch")
            })
        })
    })

    // DELETE
    it('Delete Booking - Sucesso', () => {
        cy.request('POST', 'https://restful-booker.herokuapp.com/booking', {
            "firstname": "Vinicius",
            "lastname": "Deletar",
            "totalprice": 800,
            "depositpaid": false,
            "bookingdates": {
                "checkin": "2026-08-01",
                "checkout": "2026-08-05"
            },
            "additionalneeds": "None"
        }).then((createResponse) => {
            const bookingId = createResponse.body.bookingid

            cy.request({
                method: 'DELETE',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'token=' + token
                }
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(201) // API retorna 201 ao deletar
            })

            // validar que não existe mais
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
                failOnStatusCode: false
            }).then((getResponse) => {
                expect(getResponse.status).to.eq(404)
            })
        })
    })
})
