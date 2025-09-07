import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  type:
    | 'frontend'
    | 'backend'
    | 'database'
    | 'testing'
    | 'documentation'
    | 'orchestrator'
    | 'custom';
  description: string;
  systemPrompt: string;
  capabilities: AgentCapability[];
  enabled: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  priority: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AgentMessage {
  id: string;
  agentId: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    tokens?: number;
    cost?: number;
    duration?: number;
    model?: string;
  };
}

export interface AgentConversation {
  id: string;
  title: string;
  agentIds: string[];
  messages: AgentMessage[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime?: number;
  endTime?: number;
  result?: any;
  error?: string;
}

export interface AgentsState {
  // Agent configurations
  agents: AgentConfig[];
  activeAgentIds: string[];

  // Conversations
  conversations: AgentConversation[];
  activeConversationId: string | null;

  // Tasks
  tasks: AgentTask[];

  // Orchestrator state
  orchestratorEnabled: boolean;
  orchestratorModel: string;

  // LLM providers configuration
  providers: {
    openai: {
      apiKey: string;
      baseUrl: string;
      models: string[];
    };
    anthropic: {
      apiKey: string;
      baseUrl: string;
      models: string[];
    };
    google: {
      apiKey: string;
      baseUrl: string;
      models: string[];
    };
  };

  // Usage tracking
  usage: {
    totalTokens: number;
    totalCost: number;
    requestCount: number;
    lastReset: number;
  };

  // UI state
  chatPanelVisible: boolean;
  agentsPanelVisible: boolean;
}

const initialState: AgentsState = {
  // Agent configurations
  agents: [],
  activeAgentIds: [],

  // Conversations
  conversations: [],
  activeConversationId: null,

  // Tasks
  tasks: [],

  // Orchestrator state
  orchestratorEnabled: true,
  orchestratorModel: 'gpt-4',

  // LLM providers configuration
  providers: {
    openai: {
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
    },
    anthropic: {
      apiKey: '',
      baseUrl: 'https://api.anthropic.com',
      models: ['claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'],
    },
    google: {
      apiKey: '',
      baseUrl: 'https://generativelanguage.googleapis.com',
      models: ['gemini-pro', 'gemini-pro-vision'],
    },
  },

  // Usage tracking
  usage: {
    totalTokens: 0,
    totalCost: 0,
    requestCount: 0,
    lastReset: Date.now(),
  },

  // UI state
  chatPanelVisible: false,
  agentsPanelVisible: false,
};

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    // Agent management
    addAgent: (state, action: PayloadAction<Omit<AgentConfig, 'createdAt' | 'updatedAt'>>) => {
      const now = Date.now();
      const newAgent: AgentConfig = {
        ...action.payload,
        createdAt: now,
        updatedAt: now,
      };
      state.agents.push(newAgent);
    },
    updateAgent: (state, action: PayloadAction<Partial<AgentConfig> & { id: string }>) => {
      const index = state.agents.findIndex(agent => agent.id === action.payload.id);
      if (index !== -1 && state.agents[index]) {
        Object.assign(state.agents[index], action.payload, {
          updatedAt: Date.now(),
        });
      }
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.agents = state.agents.filter(agent => agent.id !== action.payload);
      state.activeAgentIds = state.activeAgentIds.filter(id => id !== action.payload);
    },
    setActiveAgents: (state, action: PayloadAction<string[]>) => {
      state.activeAgentIds = action.payload;
    },

    // Conversations
    createConversation: (
      state,
      action: PayloadAction<Omit<AgentConversation, 'createdAt' | 'updatedAt'>>
    ) => {
      const now = Date.now();
      const conversation: AgentConversation = {
        ...action.payload,
        createdAt: now,
        updatedAt: now,
      };
      state.conversations.push(conversation);
      state.activeConversationId = conversation.id;
    },
    addMessage: (state, action: PayloadAction<AgentMessage>) => {
      if (state.activeConversationId) {
        const conversation = state.conversations.find(c => c.id === state.activeConversationId);
        if (conversation) {
          conversation.messages.push(action.payload);
          conversation.updatedAt = Date.now();
        }
      }
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      if (state.activeConversationId === action.payload) {
        state.activeConversationId =
          state.conversations.length > 0 && state.conversations[0]
            ? state.conversations[0].id
            : null;
      }
    },

    // Tasks
    addTask: (state, action: PayloadAction<AgentTask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Partial<AgentTask> & { id: string }>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1 && state.tasks[index]) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    clearCompletedTasks: state => {
      state.tasks = state.tasks.filter(
        task =>
          task.status !== 'completed' && task.status !== 'failed' && task.status !== 'cancelled'
      );
    },

    // Provider configuration
    updateProvider: (
      state,
      action: PayloadAction<{
        provider: keyof AgentsState['providers'];
        config: Partial<AgentsState['providers'][keyof AgentsState['providers']]>;
      }>
    ) => {
      state.providers[action.payload.provider] = {
        ...state.providers[action.payload.provider],
        ...action.payload.config,
      };
    },

    // Usage tracking
    updateUsage: (
      state,
      action: PayloadAction<{
        tokens: number;
        cost: number;
      }>
    ) => {
      state.usage.totalTokens += action.payload.tokens;
      state.usage.totalCost += action.payload.cost;
      state.usage.requestCount += 1;
    },
    resetUsage: state => {
      state.usage = {
        totalTokens: 0,
        totalCost: 0,
        requestCount: 0,
        lastReset: Date.now(),
      };
    },

    // UI actions
    toggleChatPanel: state => {
      state.chatPanelVisible = !state.chatPanelVisible;
    },
    toggleAgentsPanel: state => {
      state.agentsPanelVisible = !state.agentsPanelVisible;
    },
  },
});

export const {
  addAgent,
  updateAgent,
  removeAgent,
  setActiveAgents,
  createConversation,
  addMessage,
  setActiveConversation,
  removeConversation,
  addTask,
  updateTask,
  removeTask,
  clearCompletedTasks,
  updateProvider,
  updateUsage,
  resetUsage,
  toggleChatPanel,
  toggleAgentsPanel,
} = agentsSlice.actions;
