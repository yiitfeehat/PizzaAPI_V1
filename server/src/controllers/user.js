"use strict"
const { welcomeTmp } = require('../helpers/emailTemplate');
const sendMail = require('../helpers/sendMail');
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const User = require('../models/user')

module.exports = {
    list: async (req, res) => {
        /* 
          #swagger.tags = ['Users']
          #swagger.summary = 'List Users'
          #swagger.description = `
              You can send query with endpoint for filter[], search[], sort[], page, and limit.
              <ul> Examples usage:
                  <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                  <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                  <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                  <li>URL/?<b>page=2&limit=1</b></li>
              </ul>
          `
      */
        try {
            const result = await res.getModelList(User);
            const details = await res.getModelListDetails(User);

            res.status(200).send({
                error: false,
                details,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the users.",
                details: error.message
            });
        }
    },

    create: async (req, res) => {
        /* 
         #swagger.tags = ['Users']
         #swagger.summary = 'Create User'
         */

        //! // Password Validation
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        // if (!passwordRegex.test(req.body.password)) {
        //     return res.status(401).send({
        //         error: true,
        //         message: "Password must be at least 8 characters long and contain at least one special character and at least one uppercase character."
        //     });
        //! }

        let result;

        try {
            result = await User.create(req.body);
            res.status(200).send({
                error: false,
                result
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: "An error occurred while creating the user.",
                details: error.message
            });
        }

        // Kullanıcı başarılı oluşturulduysa, mail gönderimini ayrı kontrol et
        try {
            await sendMail(
                result.email, "Kayıt Başarılı!", welcomeTmp, result.username);
        } catch (mailError) {
            console.error("Email gönderilemedi:", mailError.message);
            // Email başarısız olsa da kullanıcıya hata gönderme
        }
    },


    read: async (req, res) => {
        /* 
              #swagger.tags = ['Users']
              #swagger.summary = 'Get Single User'
          */
        try {
            const result = await User.findOne({ _id: req.params.id });
            if (!result) {
                return res.status(404).send({
                    error: true,
                    message: "User not found."
                });
            }

            res.status(200).send({
                error: false,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the user.",
                details: error.message
            });
        }
    },

    update: async (req, res) => {
        /* 
                 #swagger.tags = ['Users']
                 #swagger.summary = 'Update User'
             */

        try {
            const result = await User.updateOne({ _id: req.params.id }, req.body, { runValidators: true, new: true });
            const { acknowledged, matchedCount, modifiedCount } = result;

            // İşlem MongoDB tarafından hiç kabul edilmediyse
            if (!acknowledged) {
                return res.status(400).send({
                    error: true,
                    message: "User update not acknowledged by the database."
                });
            }

            // Hiç eşleşen kayıt yoksa (kullanıcı yok)
            if (matchedCount === 0) {
                return res.status(404).send({
                    error: true,
                    message: "User not found!"
                });
            }

            // Kayıt bulundu ama değişiklik yapılmadı (veri aynı olabilir)
            if (modifiedCount === 0) {
                return res.status(400).send({
                    error: true,
                    message: "No data was modified. Request might be invalid or redundant."
                });
            }

            // Kayıt başarıyla güncellendi
            res.status(200).send({
                error: false,
                message: "User updated successfully.",
                result
            });

        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while updating the user.",
                details: error.message
            });
        }
    },

    deleteUser: async (req, res) => {
        /* 
            #swagger.tags = ['Users']
            #swagger.summary = 'Delete User'
        */

        try {
            const result = await User.deleteOne({ _id: req.params.id });
            if (result.deletedCount === 0) {
                return res.status(404).send({
                    error: true,
                    message: "User not found!"
                });
            }

            res.status(204).send({
                error: false,
                message: "User deleted successfully."
            });

        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while deleting the user.",
                details: error.message
            });
        }
    }
}
