import { motion } from 'motion/react';

const paragraphs = [
  "You've heard AI will change everything.",
  "You've seen the demos. Read the case studies. Maybe even tried a chatbot.",
  "But nothing stuck. The tools sit unused. The 'AI strategy' is still a slide deck. And your team is still doing the same manual work they did last year.",
  "You're not behind. You just haven't found the right builder yet.",
  "That's why we built Preview Labs.",
];

export default function PainNarrative() {
  return (
    <section
      className="relative z-[60]"
      style={{
        backgroundColor: '#0A0A0A',
        padding: '8rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              lineHeight: '1.4',
              color: '#ffffff',
              marginBottom: '3rem',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
