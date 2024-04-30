import express from "express";
import mysql from "mysql";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});
const upload = multer({storage:multer.memoryStorage()})

con.connect((err) => {
    if (err) {
        console.log("Error in Connection");
        console.log(err);
    } else {
        console.log("SQL server Connected");
    }
});

app.post("/register", (req, res) => {
    const { Name, DOB, Email, Mobile, Password, Role } = req.body;
    con.query("SELECT COUNT(*) AS count FROM userdetails WHERE Email = ?", [Email], (err, result) => {
        if (err) {
            console.log("Error checking email existence:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result[0].count > 0) {
            return res.status(400).json({ status:'error',message: "Email already exists" });
        }
        const sql = "INSERT INTO userdetails (Name,DOB,Mobile,Email,Password,Role) VALUES (?,?,?,?,?,?)";
        con.query(sql, [Name, DOB, Mobile, Email, Password, Role], (err, result) => {
            if (err) {
                console.log("Error in registration query:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json({ status:'success',message: "Registration successful" });
        });
    });
});

app.post("/login", (req, res) => {
  const { Email, Password } = req.body;
  let Role = '';
  let UserID = 0;

  con.query("SELECT * FROM userdetails WHERE Email = ? AND Password = ?", [Email, Password], (err, result) => {
      if (err) {
          return res.status(500).json({ status: "Error", error: "Error in running query" });
      }
      if (result.length > 0) {
          UserID = result[0].UserID; // Corrected the assignment
          Role = result[0].Role; // Corrected the assignment
          return res.json({ status:'success', Role: Role, id: UserID }); // Moved the response inside the callback
      } else {
          con.query('SELECT * FROM tenant WHERE Email = ? LIMIT 1', [Email], (tenanterr, tenantResult) => {
              if (tenanterr) {
                  return res.status(500).json({ status: "Error", error: "Error in running query" });
              }
              if (tenantResult.length > 0) {
                  UserID = tenantResult[0].TenantID;
                  Role = 'tenant';
                  return res.json({ status: 'success', Role: Role, id: UserID }); // Moved the response inside the callback
              } else {
                  return res.status(400).json({ status: "Error", message: "User Not found" }); // No user found in either table
              }
          });
      }
  });
});


  app.get('/getUserDetails', (req, res) => {
    const UserID = req.query.userID;
    con.query('SELECT * from userdetails WHERE UserID=?', [UserID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "success", Result: result[0] })
    })
  })

  // SELECT Name, PhoneNumber as Mobile FROM tenant
  app.get('/getTenantDetails', (req, res) => {
    const UserID = req.query.userID;
    con.query('SELECT Name, PhoneNumber as Mobile, PropertyID FROM tenant where TenantID=?', [UserID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "success", Result: result[0] })
    })
  })

  app.post('/addProperty', (req, res) => {
    const { LandlordID, Name, Address,Price } = req.body;
    con.query('INSERT INTO property (LandlordID, Name, Address, Price) VALUES (?, ?, ?, ?)', [LandlordID, Name, Address, Price], (err, result) => {
      if (err) {
        console.error('Error inserting booking:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ status:'success',message: 'Property Added successfully',id: result.insertId });
    });
  });

  app.post("/uploadImage",upload.single('image'), (req, res) => {
    const PropertyId = req.body.service_id;
    const image = req.file.buffer.toString('base64');
    con.query('INSERT INTO propertyimages (PropertyID, image_data) VALUES (?, ?)',[PropertyId,image],(err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ status:'success', message: "Images Added successful" });
    });
    
  });

  app.get('/getProperties', (req, res) => {
    const LandlordID = req.query.LandlordID;
    con.query('SELECT * FROM propertydetails where LandlordID = ?', [LandlordID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "Success", Result: result })
    })
  })

  app.get('/getLandLordProperties', (req, res) => {
    const LandlordID = req.query.LandlordId;
    con.query('SELECT PropertyID, Name, Address FROM propertydetails where LandlordID = ?', [LandlordID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "Success", Result: result })
    })
  })


  app.post('/addTenant', (req, res) => {
    const { Name, Email, PhoneNumber, PropertyID} = req.body;
    con.query('INSERT INTO tenant (Name, Email, PhoneNumber, PropertyID) VALUES (?, ?, ?, ?)', [Name, Email, PhoneNumber, PropertyID], (err, result) => {
      if (err) {
        console.error('Error inserting booking:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ status:'success',message: 'Property Added successfully',id: result.insertId });
    });
  });

  app.get('/PropertyDetails', (req, res) => {
    const id = req.query.PropertyID;
    const tenantsQuery = "SELECT * FROM tenant WHERE PropertyID = ?";
    const imagesQuery = "SELECT * FROM propertyimages WHERE PropertyID = ?";
    con.query(imagesQuery, [id], (err1, ImagesResults) => {
      if (err1) {
        console.error('Error executing MySQL query:', err1);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      con.query(tenantsQuery, [id], (err2, tenantsResults) => {
        if (err2) {
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        const tenantDetails = tenantsResults;
        const images = ImagesResults;


        res.json({ images, tenantDetails });
      });
    });
  });

  app.get('/getSelectedProperty', (req, res) => {
    const PropertyID = req.query.PropertyID;;
    con.query('SELECT PropertyID, Name, Address,Price FROM propertydetails where PropertyID = ?', [PropertyID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "Success", Result: result })
    })
  })

  app.get('/loadCounts', (req, res) => {
    const LandlordID = req.query.LandlordID;
    con.query('SELECT COUNT(DISTINCT p.PropertyID) AS total_Properties, COUNT(DISTINCT t.PropertyID) AS rented_Properties, SUM(CASE WHEN t.PropertyID IS NOT NULL THEN p.Price ELSE 0 END) AS income FROM property p LEFT JOIN tenant t ON p.PropertyID = t.PropertyID WHERE p.LandlordID = ?', [LandlordID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "success", Result: result[0] })
    })
  })

  app.get('/loadTenantCounts', (req, res) => {
    const LandlordID = req.query.LandlordID;
    con.query('select p.Price as Rent_per_Month from property p left join tenant t on p.PropertyID = t.PropertyID where t.TenantID = ?', [LandlordID], (err, result) => {
      if (err) return res.json({ Error: "Got an error in the sql" });
      return res.json({ Status: "success", Result: result[0] })
    })
  })

  app.post("/addMaintenanceRequest",upload.single('image'), (req, res) => {
    const {Description, Priority, TenantID, SubmittedDate,Category} = req.body;
    const image = req.file.buffer.toString('base64');
    con.query('INSERT INTO maintenancerequest (Description, Priority, TenantID, SubmittedDate,Attachments,Category) VALUES (?, ?, ?, ?, ?,?)',[Description, Priority, TenantID, SubmittedDate,image,Category],(err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ status:'success', message: "Images Added successful" });
    });
    
  });

  app.get('/loadPropertyMaintenanceRequests', (req, res) => {
    const PropertyID = req.query.PropertyID;
    con.query('SELECT m.RequestID, m.Priority, m.Description, t.Name as Requester , m.SubmittedDate, s.Name, m.Attachments, m.PropertyID FROM maintenancerequest m left join tenant t on m.TenantID = t.TenantID left join Status s on m.StatusID = s.StatusID where m.PropertyID = ?', [PropertyID], (err, result) => {
        if (err) {
            return res.json({ Status: "error", Error: "Got an error in the SQL query" });
        }
        return res.json({ Status: "success", Result: result });
    });
});

app.get('/getMaintenanceRequests', (req, res) => {
  const userID = req.query.userID;
  con.query('SELECT p.Name as PropertyName, m.*, t.Name, s.Name AS status,te.Name as TechnicianName FROM maintenancerequest m LEFT JOIN tenant t ON m.TenantID = t.TenantID LEFT JOIN status s ON m.StatusID = s.StatusID LEFT JOIN property p ON m.PropertyID = p.PropertyID left join technician te on m.TechnicianID = te.TechnicianID WHERE p.LandlordID = ?', [userID], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "success", Result: result })
  })
})

app.get('/getTenantMaintenanceRequests', (req, res) => {
  const userID = req.query.userID;
  con.query('SELECT p.Name as PropertyName, m.*, t.Name, s.Name AS status FROM maintenancerequest m LEFT JOIN tenant t ON m.TenantID = t.TenantID LEFT JOIN status s ON m.StatusID = s.StatusID LEFT JOIN property p ON m.PropertyID = p.PropertyID WHERE m.PropertyID = t.PropertyID AND t.TenantID = ?', [userID], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "success", Result: result })
  })
})

app.post('/addTechnician', (req, res) => {
  const { Name, Email, PhoneNumber, Expertise} = req.body;
  con.query('INSERT INTO technician ( Name, Email, PhoneNumber, Expertise) VALUES (?, ?, ?, ?);', [Name, Email, PhoneNumber, Expertise], (err, result) => {
    if (err) {
      console.error('Error inserting booking:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ status:'success',message: 'Technician Added successfully',id: result.insertId });
  });
});

app.get('/getTechnicians', (req, res) => {
  con.query('SELECT * FROM technician', (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "success", Result: result })
  })
})

app.put('/assignTechnician', (req, res) => {
  const { TechnicianID, RequestID } = req.body;
  con.query('UPDATE maintenancerequest SET TechnicianID = ? WHERE RequestID = ?', [TechnicianID, RequestID], (err, queryResult) => {
    if (err) {
      return res.json({ status: "Error", error: "Error Updating Application Status" });
    }
    return res.json({ status: "success" });
  });
});

app.put('/updateRequestToSuccess', (req, res) => {
  const { RequestID } = req.body;
  con.query('UPDATE maintenancerequest SET StatusID = 4 WHERE RequestID = ?', [RequestID], (err, queryResult) => {
    if (err) {
      return res.json({ status: "Error", error: "Error Updating Application Status" });
    }
    return res.json({ status: "success" });
  });
});

app.get('/getPreviousPayments', (req, res) => {
  const tenantId = req.query.TenantId;
  con.query('SELECT * FROM invoice where TenantId =? order by InvoiceID desc',[tenantId], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "success", Result: result })
  })
})

app.post('/payBill', (req, res) => {
  const { TenantId, PaidDate } = req.body;
  con.query('INSERT INTO invoice (TenantId, PaidDate) VALUES (?, ?)', [ TenantId, PaidDate ], (err, result) => {
    if (err) {
      console.error('paybill',err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ status:'success'});
  });
})

app.get('/allTenantInvoices', (req, res) => {
  const LandlordId = req.query.LandlordId;
  con.query('SELECT t.Name as TenantName, p.Name as PropertyName, i.Amount as price, i.PaidDate as paidDate FROM invoice i left join tenant t on i.TenantId = t.TenantID left join property p on i.PropertyId=p.PropertyID where p.LandlordID = ?',[LandlordId], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "success", Result: result })
  })
})

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});