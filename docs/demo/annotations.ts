export const collection = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  id: 'urn:collection:demo:plain',
  type: 'AnnotationCollection',
  total: 27,
  items: [
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:en:1',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'keyconcepts',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'KeyConcepts',
          color: '#712793',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'friendship',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'friendship',
          domain: 'social',
          abstractConcept: true,
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 27,
            end: 37,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'friendship',
            prefix: 's & Fur\nAn unlikely ',
            suffix: ' bloomed between a c',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:en:2',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'animals',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Animals',
          color: '#65a378',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'parrot',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
        {
          type: 'AnnotationMetadata',
          name: 'Flanel',
          gender: 'male',
          animalType: 'parrot',
          species: 'African Grey',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 65,
            end: 71,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'parrot',
            prefix: ' between a colorful ',
            suffix: ' and a gentle dog. O',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:en:3',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'animals',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Animals',
          color: '#65a378',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'dog',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
        {
          type: 'AnnotationMetadata',
          name: 'Venus',
          gender: 'female',
          animalType: 'dog',
          breed: 'Bernese Mountain Dog',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 85,
            end: 88,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'dog',
            prefix: 'parrot and a gentle ',
            suffix: '. One spoke in squaw',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:en:4',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'keyconcepts',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'KeyConcepts',
          color: '#712793',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'language',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'language',
          domain: 'communication',
          abstractConcept: true,
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 234,
            end: 242,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'language',
            prefix: 'ut sharing a common ',
            suffix: ', they understood ea',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:en:5',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'emotion',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Emotion',
          color: '#f3ff4d',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'warmth',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'warmth',
          domain: 'emotion',
          sentiment: 'positive',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 606,
            end: 612,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'warmth',
            prefix: ' explanation — only ',
            suffix: ', presence, and a wi',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:nl:6',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'keyconcepts',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'KeyConcepts',
          color: '#712793',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'vriendschap',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'friendship',
          domain: 'social',
          abstractConcept: true,
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 36,
            end: 47,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'vriendschap',
            prefix: 'n onwaarschijnlijke ',
            suffix: ' bloeide op tussen e',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:nl:7',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'animals',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Animals',
          color: '#65a378',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'papegaai',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
        {
          type: 'AnnotationMetadata',
          name: 'Flanel',
          gender: 'male',
          animalType: 'parrot',
          species: 'African Grey',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 81,
            end: 89,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'papegaai',
            prefix: 'ssen een kleurrijke ',
            suffix: ' en een zachte hond.',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:nl:8',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'animals',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Animals',
          color: '#65a378',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'hond',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
        {
          type: 'AnnotationMetadata',
          name: 'Venus',
          gender: 'female',
          animalType: 'dog',
          breed: 'Bernese Mountain Dog',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 104,
            end: 108,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'hond',
            prefix: 'egaai en een zachte ',
            suffix: '. De één sprak in kr',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:nl:9',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'keyconcepts',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'KeyConcepts',
          color: '#712793',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'taal',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'language',
          domain: 'communication',
          abstractConcept: true,
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 311,
            end: 315,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'taal',
            prefix: ' gemeenschappelijke ',
            suffix: ' te delen.\nElke ocht',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:nl:10',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'emotion',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Emotion',
          color: '#f3ff4d',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'warmte',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'warmth',
          domain: 'emotion',
          sentiment: 'positive',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 685,
            end: 691,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'warmte',
            prefix: 'odig heeft — alleen ',
            suffix: ', aanwezigheid en de',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:ar:11',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'keyconcepts',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'KeyConcepts',
          color: '#712793',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'صداقة',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'friendship',
          domain: 'social',
          abstractConcept: true,
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 15,
            end: 20,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'صداقة',
            prefix: 'ريش وفراء\nنشأت ',
            suffix: ' غير متوقعة بين ببغا',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:ar:12',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'animals',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Animals',
          color: '#65a378',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'ببغاء',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
        {
          type: 'AnnotationMetadata',
          name: 'Flanel',
          gender: 'male',
          animalType: 'parrot',
          species: 'African Grey',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 36,
            end: 41,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'ببغاء',
            prefix: 'داقة غير متوقعة بين ',
            suffix: ' ملوّن وكلب وديع. أح',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:ar:13',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'animals',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Animals',
          color: '#65a378',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'كلب',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
        {
          type: 'AnnotationMetadata',
          name: 'Venus',
          gender: 'female',
          animalType: 'dog',
          breed: 'Bernese Mountain Dog',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 49,
            end: 52,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'كلب',
            prefix: 'عة بين ببغاء ملوّن و',
            suffix: ' وديع. أحدهما تكلّم ',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:ar:14',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'keyconcepts',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'KeyConcepts',
          color: '#712793',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'لغة',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'language',
          domain: 'communication',
          abstractConcept: true,
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 175,
            end: 178,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'لغة',
            prefix: ' ما، دون أن يتشاركا ',
            suffix: ' مشتركة، فهم كلٌّ من',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:ar:15',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'emotion',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Emotion',
          color: '#f3ff4d',
          target: 'highlight',
        },
        {
          type: 'TextualBody',
          value: 'الدفء',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
        {
          type: 'AnnotationMetadata',
          concept: 'warmth',
          domain: 'emotion',
          sentiment: 'positive',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 462,
            end: 467,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'الدفء',
            prefix: 'تاج إلى تفسير — فقط ',
            suffix: '، والحضور، والاستعدا',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:en:1',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value: 'Feathers & Fur',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 0,
            end: 14,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'Feathers & Fur',
            prefix: '',
            suffix: '\nAn unlikely friends',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:en:2',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'An unlikely friendship bloomed between a colorful parrot and a gentle dog. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 15,
            end: 281,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'An unlikely friendship bloomed between a colorful parrot and a gentle dog. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.',
            prefix: 'Feathers & Fur\n',
            suffix: '\nEvery morning they ',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:en:3',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            "Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.",
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 282,
            end: 525,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              "Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.",
            prefix: 'ch other perfectly.\n',
            suffix: '\nTheir bond reminded',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:en:4',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'en',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:original',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 526,
            end: 661,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.',
            prefix: 'thing in the world.\n',
            suffix: '',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:nl:5',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value: 'Veren & Vacht',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 0,
            end: 13,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'Veren & Vacht',
            prefix: '',
            suffix: '\nEen onwaarschijnlij',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:nl:6',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'Een onwaarschijnlijke vriendschap bloeide op tussen een kleurrijke papegaai en een zachte hond. De één sprak in kreten en imiteerde gelach, de ander communiceerde via staartbewegingen en zachte bruine ogen. Toch begrepen ze elkaar op de een of andere manier perfect, zonder een gemeenschappelijke taal te delen.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 14,
            end: 325,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'Een onwaarschijnlijke vriendschap bloeide op tussen een kleurrijke papegaai en een zachte hond. De één sprak in kreten en imiteerde gelach, de ander communiceerde via staartbewegingen en zachte bruine ogen. Toch begrepen ze elkaar op de een of andere manier perfect, zonder een gemeenschappelijke taal te delen.',
            prefix: 'Veren & Vacht\n',
            suffix: '\nElke ochtend bezett',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:nl:7',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'Elke ochtend bezetten ze dezelfde zonnige plek op de bank, de papegaai stoutmoedig gepost op de brede rug van de hond. De hond had er nooit moeite mee. Hij zuchtte gewoon tevreden, alsof het dragen van zijn gevederde metgezel de gewoonste zaak van de wereld was.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 326,
            end: 588,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'Elke ochtend bezetten ze dezelfde zonnige plek op de bank, de papegaai stoutmoedig gepost op de brede rug van de hond. De hond had er nooit moeite mee. Hij zuchtte gewoon tevreden, alsof het dragen van zijn gevederde metgezel de gewoonste zaak van de wereld was.',
            prefix: 'ijke taal te delen.\n',
            suffix: '\nHun band herinnerde',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:nl:8',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'Hun band herinnerde iedereen in de buurt eraan dat vriendschap geen uitleg nodig heeft — alleen warmte, aanwezigheid en de bereidheid om het licht te delen.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'nl',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:translation',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 589,
            end: 745,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'Hun band herinnerde iedereen in de buurt eraan dat vriendschap geen uitleg nodig heeft — alleen warmte, aanwezigheid en de bereidheid om het licht te delen.',
            prefix: ' van de wereld was.\n',
            suffix: '',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:ar:9',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value: 'ريش وفراء',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 0,
            end: 9,
          },
          {
            type: 'TextQuoteSelector',
            exact: 'ريش وفراء',
            prefix: '',
            suffix: '\nنشأت صداقة غير متوق',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:ar:10',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'نشأت صداقة غير متوقعة بين ببغاء ملوّن وكلب وديع. أحدهما تكلّم بالصياح وقلّد الضحكات، والآخر تواصل بتلويح الذيل وعيون بنية ناعمة. ومع ذلك، وبطريقة ما، دون أن يتشاركا لغة مشتركة، فهم كلٌّ منهما الآخر تمامًا.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 10,
            end: 215,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'نشأت صداقة غير متوقعة بين ببغاء ملوّن وكلب وديع. أحدهما تكلّم بالصياح وقلّد الضحكات، والآخر تواصل بتلويح الذيل وعيون بنية ناعمة. ومع ذلك، وبطريقة ما، دون أن يتشاركا لغة مشتركة، فهم كلٌّ منهما الآخر تمامًا.',
            prefix: 'ريش وفراء\n',
            suffix: '\nكل صباح كانا يحتلان',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:ar:11',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'كل صباح كانا يحتلان نفس البقعة المشمسة على الأريكة، يجلس الببغاء بجرأة على ظهر الكلب العريض. لم يكترث الكلب قط. كان يتنهّد باكتفاء، كأن حمل رفيقه ذي الريش كان أمرًا طبيعيًا تمامًا.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 216,
            end: 396,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'كل صباح كانا يحتلان نفس البقعة المشمسة على الأريكة، يجلس الببغاء بجرأة على ظهر الكلب العريض. لم يكترث الكلب قط. كان يتنهّد باكتفاء، كأن حمل رفيقه ذي الريش كان أمرًا طبيعيًا تمامًا.',
            prefix: 'منهما الآخر تمامًا.\n',
            suffix: '\nذكّرت علاقتهما كل م',
          },
        ],
      },
    },
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'urn:annotation:demo:plain:paragraph:ar:12',
      type: 'Annotation',
      motivation: 'tagging',
      body: [
        {
          id: 'paragraph',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Paragraph',
          color: '#1e55cf',
          target: 'gutter',
        },
        {
          type: 'TextualBody',
          value:
            'ذكّرت علاقتهما كل من حولهما بأن الصداقة لا تحتاج إلى تفسير — فقط الدفء، والحضور، والاستعداد للتشارك في النور.',
          format: 'text/plain',
          purpose: 'tagging',
          language: 'ar',
        },
      ],
      target: {
        type: 'SpecificResource',
        source: 'urn:demo:plain:arabic',
        selector: [
          {
            type: 'TextPositionSelector',
            start: 397,
            end: 506,
          },
          {
            type: 'TextQuoteSelector',
            exact:
              'ذكّرت علاقتهما كل من حولهما بأن الصداقة لا تحتاج إلى تفسير — فقط الدفء، والحضور، والاستعداد للتشارك في النور.',
            prefix: 'رًا طبيعيًا تمامًا.\n',
            suffix: '',
          },
        ],
      },
    },
  ],
};
