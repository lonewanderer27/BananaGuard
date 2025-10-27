from typing import Optional
from llm.templates.template_types import TemplateTypes
from llm.templates.general_inquiry import general_inquiry_template
from llm.templates.analysis_insight import analysis_insight_template
from llm.templates.follow_up import follow_up, do_not_follow_up

def prompt_builder(type: TemplateTypes, context: str, inquiry: str, analysis: Optional[dict[str, int]]) -> str:
    if type == TemplateTypes.GeneralInquiry:
        return general_inquiry_template.format(
            context=context, 
            inquiry=inquiry
        ).__add__(do_not_follow_up)
    elif type == TemplateTypes.AnalysisInsight:
        analysis_text = "\n".join([f"- {disease}: {confidence}%" for disease, confidence in analysis.items()])
        return analysis_insight_template.format(
            context=context, 
            inquiry=inquiry, 
            analysis_summary=analysis_text
        ).__add__(do_not_follow_up)