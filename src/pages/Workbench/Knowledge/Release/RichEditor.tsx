import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import type { FC } from 'react';
import 'bytemd/dist/index.css';
import 'github-markdown-css';
import styles from './editor.scss';

const plugins = [gfm()];

interface RichEditorProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const RichEditor: FC<RichEditorProps> = ({ value, setValue }) => {
  return (
    <div className={styles.editorContainer}>
      <Editor
        value={value}
        plugins={plugins}
        maxLength={10000}
        onChange={v => {
          setValue(v);
        }}
      />
    </div>
  );
};
export default RichEditor;
