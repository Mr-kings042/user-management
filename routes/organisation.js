const express = require ('express');
const {
    getOrganisations,
    getOrganisation,
    createOrganisation,
    addUser
} = require ('../controllers/organisation');
const router = express.Router();
const verifyToken = require ('../middleware/TokenHandler');

router.get("/api/organisations", verifyToken,getOrganisations);
router.get("/api/organisations/:orgId", verifyToken,getOrganisation);
router.post("/api/organisations", verifyToken, createOrganisation);
router.get("api/organisations/:orgId/users", addUser);

module.exports = router;