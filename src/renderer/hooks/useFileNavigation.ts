import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openFile } from '../store/slices/editorSlice';

export const useFileNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenFile = (event: CustomEvent<{ filePath: string; content: string }>) => {
      const { filePath, content } = event.detail;
      console.log('Opening file in editor:', filePath);
      
      // Dispatch action to open file in editor
      dispatch(openFile({ filePath, content }));
      
      // Navigate to editor view
      navigate('/editor');
    };

    // Listen for file open events
    window.addEventListener('openFileInEditor' as any, handleOpenFile);
    
    return () => {
      window.removeEventListener('openFileInEditor' as any, handleOpenFile);
    };
  }, [dispatch, navigate]);
};