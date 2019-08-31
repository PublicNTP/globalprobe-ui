const rawData = {
   "servers": {
      "stratum2-01.bom01.publicntp.org": {
         "display_name": "South Asia server",
         "display_description": "Description for this server",
         "display_location": "Mumbai, India",
         "notes": "Server is racked in datacenter X, row Y, rack unit Z",
         "server_addresses": [ "127.1.2.3", "127.9.8.7", "::1" ]
      },

      "stratum2-01.sin01.publicntp.org": {
         "display_name": "Southeast Asia server",
         "display_description": "Description for another server",
         "display_location": "Singapore",
         "notes": "Server is a VM with DigitalOcean",
         "server_addresses": [ "127.127.127.127", "127.4.5.6", "::1" ]
      }
   }
}

const serversList = [rawData.servers["stratum2-01.bom01.publicntp.org"], rawData.servers["stratum2-01.sin01.publicntp.org"]]

export default serversList