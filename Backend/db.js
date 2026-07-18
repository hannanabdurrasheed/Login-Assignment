const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=LoginSystemDB;Trusted_Connection=Yes;TrustServerCertificate=Yes;"
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("✅ Connected to SQL Server");
    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
    }
}

module.exports = {
    sql,
    connectDB
};