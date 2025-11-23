# LangGraph Agentic Framework Implementation

## Overview

The system has been refactored to use **LangGraph.js** - a proper agentic AI framework for building multi-agent systems. This replaces the custom orchestration with a graph-based workflow.

## What Changed

### Before (Custom Orchestration)
- Manual function calls in sequence
- Custom state management
- No framework support

### After (LangGraph)
- **StateGraph** for workflow management
- **Nodes** for each agent (Analyzer, Orchestrator, Interviewer, Feedback)
- **Conditional edges** for routing
- **Proper state management** with reducers
- **Graph compilation** for execution

## Architecture

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌──────────┐
│ Analyzer │  ← Evaluates user response
└────┬─────┘
     │
     ▼
┌──────────────┐
│ Orchestrator │  ← Decides next action
└──────┬───────┘
       │
       ├─[shouldEnd?]─→ ┌──────────┐
       │                │ Feedback │  ← Final evaluation
       │                └────┬─────┘
       │                     │
       │                     ▼
       │                  ┌─────┐
       │                  │ END │
       │                  └─────┘
       │
       └─[continue]─→ ┌────────────┐
                      │ Interviewer│  ← Generate question
                      └──────┬─────┘
                             │
                             ▼
                          ┌─────┐
                          │ END │
                          └─────┘
```

## Implementation Details

### File: `src/services/langgraphWorkflow.ts`

#### 1. Graph State
```typescript
interface GraphState extends InterviewState {
  lastUserMessage?: string;
  analyzerOutput?: AnalyzerResponse;
  orchestratorOutput?: OrchestratorResponse;
  interviewerOutput?: InterviewerResponse;
  feedbackOutput?: FeedbackResponse;
  currentMessage?: string;
  error?: string;
}
```

#### 2. Agent Nodes

Each agent is a **node** in the graph:

- **`analyzerNode`**: Evaluates user response
- **`orchestratorNode`**: Decides next action
- **`interviewerNode`**: Generates question
- **`feedbackNode`**: Final evaluation

Each node:
- Takes full `GraphState` as input
- Returns `Partial<GraphState>` as output
- LangGraph automatically merges updates

#### 3. Conditional Routing

```typescript
function routeDecision(state: GraphState): string {
  const decision = state.orchestratorOutput;
  
  if (decision?.shouldEnd || decision?.nextAgent === 'feedback') {
    return 'feedback';
  }
  
  if (decision?.nextAgent === 'interviewer') {
    return 'interviewer';
  }
  
  return 'end';
}
```

#### 4. Graph Construction

```typescript
const workflow = new StateGraph<GraphState>(stateReducer);

// Add nodes
workflow.addNode('analyzer', analyzerNode);
workflow.addNode('orchestrator', orchestratorNode);
workflow.addNode('interviewer', interviewerNode);
workflow.addNode('feedback', feedbackNode);

// Add edges
workflow.addEdge(START, 'analyzer');
workflow.addEdge('analyzer', 'orchestrator');
workflow.addConditionalEdges('orchestrator', routeDecision, {
  interviewer: 'interviewer',
  feedback: 'feedback',
  end: END,
});
workflow.addEdge('interviewer', END);
workflow.addEdge('feedback', END);

// Compile
return workflow.compile();
```

#### 5. Execution

```typescript
const graph = getInterviewGraph();
const result = await graph.invoke(initialState);
```

## Benefits of LangGraph

### 1. **Proper Agentic Framework**
- Built specifically for multi-agent systems
- Graph-based control flow
- State management built-in

### 2. **Visual Workflow**
- Can visualize the graph
- Clear agent interactions
- Easy to understand flow

### 3. **State Management**
- Automatic state merging
- Type-safe state updates
- No manual state synchronization

### 4. **Conditional Routing**
- Built-in conditional edges
- Dynamic workflow control
- Easy to add new paths

### 5. **Extensibility**
- Easy to add new agents
- Simple to modify flow
- Framework handles complexity

## Usage

### Initialize Interview
```typescript
const { state, message } = await initializeInterviewSession(
  sessionId,
  'backend',
  'mid',
  'chat'
);
```

### Process Response (Runs LangGraph)
```typescript
const result = await processUserResponse(sessionId, userMessage);
// This internally:
// 1. Updates state with user message
// 2. Invokes LangGraph workflow
// 3. Graph runs: Analyzer → Orchestrator → Interviewer/Feedback
// 4. Returns result
```

### Generate Feedback
```typescript
const feedback = await generateInterviewFeedback(sessionId);
// LangGraph routes to feedback node
```

## Migration from Custom Workflow

The old `agentWorkflow.ts` is kept for reference, but controllers now use `langgraphWorkflow.ts`:

```typescript
// Old
import * as agentWorkflow from '../services/agentWorkflow';

// New
import * as agentWorkflow from '../services/langgraphWorkflow';
```

The API remains the same, but now uses LangGraph internally.

## LangGraph Features Used

✅ **StateGraph** - Main graph class  
✅ **Nodes** - Agent functions  
✅ **Edges** - Linear flow  
✅ **Conditional Edges** - Dynamic routing  
✅ **State Reducer** - Automatic state merging  
✅ **Graph Compilation** - Optimized execution  

## Future Enhancements

With LangGraph, we can easily add:

- **Checkpointing** - Save/restore state
- **Human-in-the-loop** - Pause for approval
- **Parallel execution** - Run agents in parallel
- **Error recovery** - Automatic retry logic
- **Graph visualization** - Visual workflow editor
- **Memory management** - Long-term memory
- **Tool calling** - Agents can use tools

## Documentation

- **LangGraph Docs**: https://js.langchain.com/docs/langgraph
- **StateGraph API**: https://js.langchain.com/docs/langgraph/graphs
- **Conditional Edges**: https://js.langchain.com/docs/langgraph/conditional-edges

## Summary

✅ **Proper agentic framework** (LangGraph.js)  
✅ **Graph-based workflow** (StateGraph)  
✅ **Agent nodes** (Analyzer, Orchestrator, Interviewer, Feedback)  
✅ **Conditional routing** (Dynamic flow control)  
✅ **State management** (Automatic merging)  
✅ **Type-safe** (TypeScript throughout)  

The system is now a **true agentic multi-agent system** using industry-standard frameworks! 🚀

