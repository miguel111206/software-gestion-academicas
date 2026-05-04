import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ label, value }) {
  return (
    <motion.article className="metric" whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </motion.article>
  );
}
