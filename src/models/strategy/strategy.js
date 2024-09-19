import passport from "passport";
import { Strategy } from "passport-local";
import { registered_hospitals } from "../mongoose/reghosschema.js";
import { patientdbs } from "../mongoose/patientschema.js";
import bcrypt from "bcrypt";

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser(async (user, done) => {
  if (user.username) {
    try {
      const hospital = await registered_hospitals.findOne({ "admins.username": user.username });
      if (!hospital) throw new Error("User not found")
      if (!hospital.hos_id) throw new Error("Hospital not registered")
      done(null, hospital.hos_id);
    }
    catch (err) {
      done(err, null);
    }
  }

  else {
    try {
      const patient = await patientdbs.findOne({ 'mobile': user.mobile });
      if (!patient) throw new Error("User not found")
      done(null, patient.id);
    }
    catch (err) {
      done(err, null);
    }
  }

})

export const hosauth = passport.use('hospitalauth',
  new Strategy(async (username, password, done) => {
    try {
      // Find the hospital where the admin username matches
      const hospital = await registered_hospitals.findOne({ 'admins.username': username });
      if (!hospital) {
        return done(null, false, { message: "Invalid username" }); // Username not found
      }
      // Find the specific admin object
      let admin = hospital.admins.find(admin => admin.username === username);
      if (!admin) {
        return done(null, false, { message: "Invalid username" }); // Admin not found
      }

      // Assuming passwords are hashed using bcrypt, compare the passwords
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Invalid password" }); // Password does not match
      }
      // Successful authentication
      return done(null, admin); // Pass the admin object if authentication is successful

    } catch (error) {
      return done(error); // Return error if something goes wrong
    }
  }
  )
)

export const ptauth = passport.use('patauth',
  new Strategy(async (username, password, done) => {
    try {
      let pat = await patientdbs.findOne({ 'mobile': username });
      if (!pat) {
        return done(null, false, { message: "Invalid mobile number" }); // Username not found
      }
      // Assuming passwords are hashed using bcrypt, compare the passwords
      const passwordMatch = await bcrypt.compare(password, pat.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Invalid password" }); // Password does not match
      }
      // Successful authentication
      return done(null, pat); // Pass the admin object if authentication is successful

    } catch (error) {
      return done(error); // Return error if something goes wrong
    }
  }
  )
)