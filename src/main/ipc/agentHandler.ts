import { IpcMainInvokeEvent } from 'electron';
import { AgentRequest, AgentResponse } from '../../shared/types/ipc';
import { Logger } from '../logger';

const logger = Logger.getInstance();

export class AgentHandler {
  private agents: Map<string, AgentInstance> = new Map();

  async sendToAgent(_event: IpcMainInvokeEvent, request: AgentRequest): Promise<AgentResponse> {
    const { agentId, message, context } = request;

    logger.info('Sending message to agent:', { agentId, messageLength: message.length });

    try {
      // Get or create agent instance
      let agent = this.agents.get(agentId);
      if (!agent) {
        agent = this.createAgentInstance(agentId);
        this.agents.set(agentId, agent);
      }

      // Process message through agent
      const response = await agent.processMessage(message, context);

      logger.info('Agent response received:', {
        agentId,
        responseLength: response.length,
        hasMetadata: !!context,
      });

      return {
        agentId,
        response,
        metadata: {
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - Date.now(), // TODO: Implement actual timing
        },
      };
    } catch (error) {
      logger.error('Agent processing failed:', { agentId, error });
      throw error;
    }
  }

  private createAgentInstance(agentId: string): AgentInstance {
    logger.info('Creating agent instance:', { agentId });

    // For now, return a mock agent
    // This will be replaced with actual agent implementation
    return new MockAgent(agentId);
  }
}

interface AgentInstance {
  processMessage(message: string, context?: Record<string, any>): Promise<string>;
}

class MockAgent implements AgentInstance {
  constructor(private agentId: string) {}

  async processMessage(message: string, _context?: Record<string, any>): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    return `Mock response from ${this.agentId}: I received "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`;
  }
}
