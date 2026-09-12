import os

class RAGAgent:
    """
    Agent 8 - Learning Resources / RAG Agent (LLM-powered Agent)
    Responsibilities: Suggest learning resources and reference materials based on topic.
    """
    
    @staticmethod
    def get_reference_materials(topic_name: str) -> list:
        """
        Uses LLM to recommend external reference materials for a given topic.
        """
        prompt = (
            f"You are a helpful teaching assistant. Provide 2 highly relevant academic "
            f"reference materials or textbooks for the computer science topic: '{topic_name}'. "
            f"Return ONLY a python list of strings."
        )
        
        try:
            import litellm
            import ast
            model_name = os.getenv("MODEL_NAME", "ollama/deepseek-r1:8b")
            response = litellm.completion(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                api_base=os.getenv("OLLAMA_API_BASE", "http://localhost:11434"),
                timeout=5.0
            )
            content = response.choices[0].message.content.strip()
            # Attempt to safely parse a list from the LLM response
            import re
            match = re.search(r'\[.*\]', content, re.DOTALL)
            if match:
                return ast.literal_eval(match.group(0))
            return [content]
        except Exception as e:
            # Fallback
            return [f"Standard Textbook for {topic_name}", "Online Documentation"]
