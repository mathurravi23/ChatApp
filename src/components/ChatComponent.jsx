import { useState } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBedrockClient = async () => {
    try {
      // Get the current session and user
      const { tokens } = await fetchAuthSession();
      const user = await getCurrentUser();
      
      // Configure Cognito Identity credentials
      const credentials = fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ 
          region: import.meta.env.VITE_AWS_REGION 
        }),
        identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
        logins: {
          [`cognito-idp.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${import.meta.env.VITE_USER_POOL_ID}`]: tokens.idToken.toString()
        }
      });

      // Create Bedrock client with Cognito credentials
      return new BedrockRuntimeClient({
        region: import.meta.env.VITE_AWS_REGION,
        credentials: credentials
      });
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw new Error('Failed to initialize Bedrock client: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const client = await getBedrockClient();
      
      const command = new InvokeModelWithResponseStreamCommand({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 4096,
          messages: [{ role: "user", content: message }]
        })
      });

      const response = await client.send(command);
      
      for await (const chunk of response.body) {
        if (chunk.chunk) {
          const chunkData = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
          if (chunkData.type === 'content_block_delta') {
            setResponse(prev => prev + chunkData.delta.text);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message}>
          {isLoading ? 'Processing...' : 'Send'}
        </button>
      </form>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      {response && (
        <div className="response">
          {response}
        </div>
      )}
    </div>
  );
};

export default ChatComponent;