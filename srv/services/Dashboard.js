const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { uuid } = require('uuidv4');
const format = require('pg-format');


class Dashboard {
    async createDashboard(fastify, req, res) {
        let payload = {
            projectID: req.body['projectID'],
            name: req.body['name'],
            description: req.body['description'],
            configData: req.body['configData'],
            modifiedBy: req.body['modifiedBy']
        }
        let result = await prisma.Dashboard.create({
            data: payload
        })
        return { message: "Dashboard Created Successfully" }
    }

    async getDashboards(fastify, req, res) {
        const dashbaords = await prisma.Dashboard.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                modifiedBy: true,
                modifiedAt: true,
                project: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [
                {
                    modifiedAt: 'desc',
                }
            ]
        })
        return dashbaords
    }

    async getDashboardDetails(fastify, req, res) {
        const dashbaordDetails = await prisma.Dashboard.findFirst({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                description: true,
                modifiedBy: true,
                modifiedAt: true,
                configData: true,
                project: {
                    select: {
                        name: true,
                        id: true,
                        configData: true,
                        calculatedColumns:true
                    },
                },
            }
        })
        return dashbaordDetails
    }

    async deleteDashboard(fastify, req, res) {
        const dashboard = await prisma.Dashboard.delete({
            where: {
                id: req.params.id
            }
        })
        return dashboard
    }

    async updateDashboardConfig(fastify, req, res) {
        const dashboard = await prisma.Dashboard.update({
            where: {
                id: req.params.id,
            },
            data: {
                configData: req.body,
            },
        })
        return dashboard
    }

}

module.exports = Dashboard;
