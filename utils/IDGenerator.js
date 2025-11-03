import crypto from "crypto";

export class IDGenerator {
  static generateUID(firstname, lastname, email) {
    firstname = firstname.trim().toLowerCase();
    lastname = lastname.trim().toLowerCase();
    email = email.trim().toLowerCase();

    // Include current timestamp for uniqueness
    const timestamp = Date.now().toString(); // milliseconds since 1970
    const combined = `${firstname}|${lastname}|${email}|${timestamp}`;

    const hashBytes = crypto.createHash("sha256").update(combined).digest();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let uidBody = "";
    for (const byte of hashBytes) {
      uidBody += chars[byte % chars.length];
    }

 
    const uid = "PID-" + uidBody.slice(0, 11);
    return uid;
  }

  static generateAccessID(uid, name, email) {
    uid = uid.trim().toLowerCase();
    name = name.trim().toLowerCase();
    email = email.trim().toLowerCase();

   
    const unique = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const combined = `${uid}|${name}|${email}|${unique}`;

    const hashBytes = crypto.createHash("sha256").update(combined).digest();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let uidBody = "";
    for (const byte of hashBytes) {
      uidBody += chars[byte % chars.length];
    }

    
    const accessID = "P" + uidBody.slice(0, 19);
    return accessID;
  }
}
