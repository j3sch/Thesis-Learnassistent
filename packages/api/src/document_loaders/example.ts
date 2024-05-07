[
  Document {
    pageContent: 'SummarizationSummarization is the task of producing a shorter version of a document while preserving its important information. Some models can extract text from the original input, while other models can generate entirely new text.table th:first-of-type{width:10em}ModelDescriptionbart-large-cnnBetaBART is a transformer encoder-encoder (seq2seq) model with a bidirectional (BERT-like) encoder and an autoregressive (GPT-like) decoder. You can use this model for text summarization.​​\n' +
      'Text ClassificationSentiment analysis or text classification is a common NLP task that classifies a text input into labels or classes.table th:first-of-type{width:10em}ModelDescriptiondistilbert-sst-2-int8Distilled BERT model that was finetuned on SST-2 for sentiment classification​​',
    metadata: {
      loc: [Object],
      source: 'https://developers.cloudflare.com/workers-ai/models/'
    }
  },
  Document {
    pageContent: 'Text-to-ImageGenerates images from input text. These models can be used to generate and modify images based on text prompts.table th:first-of-type{width:10em}ModelDescriptiondreamshaper-8-lcmBetaStable Diffusion model that has been fine-tuned to be better at photorealism without sacrificing range.stable-diffusion-v1-5-img2imgBetaStable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images. Img2img generate a new image from an input image with Stable Diffusion.stable-diffusion-v1-5-inpaintingBetaStable Diffusion Inpainting is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input, with the extra capability of inpainting the pictures by using a mask.stable-diffusion-xl-base-1.0BetaDiffusion-based text-to-image generative model by Stability AI. Generates and modify images based on text prompts.stable-diffusion-xl-lightningBetaSDXL-Lightning is a lightning-fast text-to-image generation model. It can generate high-quality',
    metadata: {
      loc: [Object],
      source: 'https://developers.cloudflare.com/workers-ai/models/'
    }
  },
  Document {
    pageContent: 'Image-to-Texttable th:first-of-type{width:10em}ModelDescriptionuform-gen2-qwen-500mBetaUForm-Gen is a small generative vision-language model primarily designed for Image Captioning and Visual Question Answering. The model was pre-trained on the internal image captioning dataset and fine-tuned on public instructions datasets: SVIT, LVIS, VQAs datasets.​​\n' +
      'Object DetectionObject detection models can detect instances of objects like persons, faces, license plates, or others in an image. This task takes an image as input and returns a list of detected objects, each one containing a label, a probability score, and its surrounding box coordinates.table th:first-of-type{width:10em}ModelDescriptiondetr-resnet-50BetaDEtection TRansformer (DETR) model trained end-to-end on COCO 2017 object detection (118k annotated images).​​',
    metadata: {
      loc: [Object],
      source: 'https://developers.cloudflare.com/workers-ai/models/'
    }
  },
  Document {
    pageContent: 'Text EmbeddingsFeature extraction models transform raw data into numerical features that can be processed while preserving the information in the original dataset. These models are ideal as part of building vector search applications or Retrieval Augmented Generation workflows with Large Language Models (LLM).table th:first-of-type{width:10em}ModelDescriptionbge-base-en-v1.5BAAI general embedding (bge) models transform any given text into a compact vectorbge-large-en-v1.5BAAI general embedding (bge) models transform any given text into a compact vectorbge-small-en-v1.5BAAI general embedding (bge) models transform any given text into a compact vector​​',
    metadata: {
      loc: [Object],
      source: 'https://developers.cloudflare.com/workers-ai/models/'
    }
  }
]