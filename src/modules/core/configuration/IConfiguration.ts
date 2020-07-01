export default interface IConfiguration {
   region: string;
   logLevel: string;
   cbRootApi: string;
   cbRootApiReadOnly: string;
   stage: string;
   accountNumber: string;
   clientId: string;
   clientIdReadOnly: string;
   sharedSecret: string;
   sharedSecretReadOnly: string;
   kenexaCertPwd: string;
   scalyrURL: string;
   scalyrLog: string;
   scalyrToken: string;
   scalyrTimeout: string;
   loggerName: string;
   cbApplyBaseUrl: string;
   bhTimeout: string;
   teePackageSize: string;
   teeTimeout: string;
   tbeTimeout: string;
   icimsTimeout: string;
}
