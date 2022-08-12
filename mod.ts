export class OIDC {
    private endpoint: string;
    private client_id: string;
    private client_secret: string;
    private redirectUrl: string;

    constructor(endpoint: string, client_id: string, client_secret: string, redirectUrl: string) {
        this.endpoint = endpoint;
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirectUrl = redirectUrl;
    }


    // generate the authorization url
    public generateAuthUrl(scopes:string[], state:string) {
        return `${this.endpoint}/authorize/?client_id=${this.client_id}&redirect_uri=${this.redirectUrl}&response_type=code&scope=${scopes.join(" ")}&state=${state}`;
    }

    public async authUser(code:string) {
        const req = await fetch(`${this.endpoint}/application/o/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Auhorization": `Basic ${btoa(`${this.client_id}:${this.client_secret}`)}`
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUrl}`
        })

        try {
            const response = await req.json();
            if(response.access_token) {
                return await this.getUserData(response.access_token);
            } else {
                return {
                    success: false,
                    error: "Invalid response, no access token"
                }
            }
        } catch (error) {
            return {
                success: false,
                error: "Invalid response"
            }
        }

    }



    private async getUserData(access_token){
        const req = await fetch(`${this.endpoint}/application/o/userinfo/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Auhorization": `Basic ${btoa(`${this.client_id}:${this.client_secret}`)}`
            },
            body: `access_token=${access_token}`
        })

        try {
            const response = await req.json();
            return {
                sucess: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: "Invalid response, cannot get user data"
            }
        }
    }

}
