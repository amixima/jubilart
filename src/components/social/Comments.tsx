'use client';

import { useState } from 'react';
import { User, MessageCircle, Send, MoreHorizontal, Edit, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  content: string;
  createdAt: string;
  isEdited?: boolean;
  isOwn?: boolean;
}

interface CommentsProps {
  artworkId: string;
  initialComments?: Comment[];
  onAddComment?: (artworkId: string, content: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onReportComment?: (commentId: string) => Promise<void>;
}

export default function Comments({
  artworkId,
  initialComments = [],
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  // Mock data for demonstration
  const mockComments: Comment[] = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Jane Smith',
        username: 'janesmith',
        profileImage: '/images/user1.jpg',
        isVerified: true
      },
      content: 'This is absolutely stunning! I love the use of color and the composition.',
      createdAt: '2024-03-15T14:30:00Z',
      isOwn: false
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Michael Johnson',
        username: 'mjohnson',
        profileImage: '/images/user2.jpg'
      },
      content: 'The technique here is remarkable. Would love to know more about your process.',
      createdAt: '2024-03-16T09:15:00Z',
      isOwn: false
    },
    {
      id: '3',
      user: {
        id: 'currentuser',
        name: 'Current User',
        username: 'currentuser',
        profileImage: '/images/currentuser.jpg'
      },
      content: 'I\'ve been following your work for a while now, and this might be my favorite piece yet!',
      createdAt: '2024-03-17T11:45:00Z',
      isOwn: true
    }
  ];
  
  // Use mock data if no initial comments provided
  useState(() => {
    if (comments.length === 0) {
      setComments(mockComments);
    }
  });
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (onAddComment) {
        await onAddComment(artworkId, newComment);
      }
      
      // For demonstration, add to local state
      const newCommentObj: Comment = {
        id: `temp-${Date.now()}`,
        user: {
          id: 'currentuser',
          name: 'Current User',
          username: 'currentuser',
          profileImage: '/images/currentuser.jpg'
        },
        content: newComment,
        createdAt: new Date().toISOString(),
        isOwn: true
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (onEditComment) {
        await onEditComment(commentId, editContent);
      }
      
      // For demonstration, update local state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: editContent, isEdited: true } 
            : comment
        )
      );
      
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      if (onDeleteComment) {
        await onDeleteComment(commentId);
      }
      
      // For demonstration, update local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };
  
  const handleReportComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to report this comment?')) return;
    
    try {
      if (onReportComment) {
        await onReportComment(commentId);
      }
      
      alert('Thank you for your report. We will review this comment shortly.');
    } catch (error) {
      console.error('Error reporting comment:', error);
      alert('Failed to report comment. Please try again.');
    }
  };
  
  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  return (
    <div className="space-y-6" id="comments">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <MessageCircle className="mr-2" size={20} />
        Comments ({comments.length})
      </h2>
      
      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {/* User avatar or placeholder */}
            <User className="text-gray-500" size={20} />
          </div>
        </div>
        
        <div className="flex-grow relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={2}
          ></textarea>
          
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="absolute bottom-2 right-2 p-1.5 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageCircle size={32} className="mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <Link href={`/users/${comment.user.id}`}>
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {comment.user.profileImage ? (
                      <img 
                        src={comment.user.profileImage} 
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="text-gray-500" size={20} />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              
              <div className="flex-grow">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        href={`/users/${comment.user.id}`}
                        className="font-medium text-gray-900 hover:text-indigo-600 flex items-center"
                      >
                        {comment.user.name}
                        {comment.user.isVerified && (
                          <span className="ml-1 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </Link>
                      <div className="text-xs text-gray-500">
                        @{comment.user.username} • {formatDate(comment.createdAt)}
                        {comment.isEdited && <span className="ml-1">(edited)</span>}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="dropdown">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="dropdown-menu hidden absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                          {comment.isOwn ? (
                            <>
                              <button
                                onClick={() => startEditing(comment)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Edit size={14} className="mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleReportComment(comment.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <AlertCircle size={14} className="mr-2" />
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        rows={3}
                      ></textarea>
                      
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          disabled={!editContent.trim() || isSubmitting}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-800">{comment.content}</p>
                  )}
                </div>
                
                {/* Comment actions */}
                <div className="flex items-center space-x-4 mt-1 ml-1">
                  <button className="text-xs text-gray-500 hover:text-indigo-600">
                    Like
                  </button>
                  <button className="text-xs text-gray-500 hover:text-indigo-600">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
