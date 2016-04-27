
module.exports = angular.module("franklin-dashboard.config", [])

.constant("ENV", {
	"FRANKLIN_API_URL": process.env.FRANKLIN_API_URL});
