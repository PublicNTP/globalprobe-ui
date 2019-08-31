<template>
    <div id="authenticator">
          <amplify-authenticator :authConfig="awsAuthOptions"></amplify-authenticator>
    </div>
</template>


<script>
export default {
    data () {
        return {
            signedIn: false,
            signedInProfile: null,
            awsAuthOptions: {
                signInConfig: {
                    header: this.$Amplify.I18n.get('Sign In Account'),
                    username: '',
                    isSignUpDisplayed: true
                },
                signUpConfig: {
                hideAllDefaults: true,
                hiddenDefaults: ['phone_number', 'email'],
                signUpFields: [ {
                    label: "Email Address",
                    key: "username",
                    required: true,
                    displayOrder: 1,
                    type: "email",
                    custom: false
                    }, {
                    label: "Password",
                    key: "password",
                    required: true,
                    displayOrder: 2,
                    type: "password",
                    custom: false
                    }
                ]
                }
            }
        }
  },
}
</script>

<style lang="scss" scoped>

</style>
