// src/components/Review.jsx (modified parts)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, addReview, deleteReview, updateReview } from "../features/reviews/reviewsSlice";

const Review = ({ serviceId, completedBookings }) => {
    const dispatch = useDispatch();
    const authUser = useSelector((s) => s.auth.user);
    const { reviews } = useSelector((s) => s.reviews);

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [bookingId, setBookingId] = useState("");
    // EDIT state
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);
    const canReview = completedBookings.length > 0;

    useEffect(() => {
        dispatch(fetchReviews(serviceId));
    }, [dispatch, serviceId]);

    const startEdit = (rev) => {
        setEditingReviewId(rev.id);
        setEditComment(rev.comment || "");
        setEditRating(rev.rating || 5);
    };

    const cancelEdit = () => {
        setEditingReviewId(null);
        setEditComment("");
        setEditRating(5);
    };

    const submitEdit = async () => {
        if (!editingReviewId) return;
        await dispatch(updateReview({ id: editingReviewId, rating: editRating, comment: editComment }));
        cancelEdit();
    };

    const handleSubmit = async () => {
        console.log("Booking ID:", bookingId);
        console.log("Comment:", comment);
        console.log("Rating:", rating);

        if (!bookingId || !comment) {
            alert("Please select a booking and write a comment.");
            return;
        }

        const res = await dispatch(addReview({ serviceId, bookingId, rating, comment }));

        if (res.meta.requestStatus === "fulfilled") {
            setBookingId("");
            setComment("");
            setRating(5);
        } else {
            alert("Failed to submit review. Try again.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            await dispatch(deleteReview({ id }));
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            {/* submit part unchanged */}
            {authUser && canReview && (
                <div className="mb-4 flex flex-col gap-2">
                    {/* ✅ Booking ID dropdown */}
                    <select
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="border p-2 rounded mb-2"
                    >
                        <option value="">Select a completed booking</option>
                        {completedBookings.map((b) => (
                            <option key={b.id} value={b.id}>
                                Booking {b.id} - {new Date(b.updatedAt || b.completedAt).toLocaleDateString()}
                            </option>
                        ))}
                    </select>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full border p-2 rounded mb-2"
                    />

                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border p-1 rounded mb-2"
                    >
                        {[5, 4, 3, 2, 1].map((v) => (
                            <option key={v} value={v}>
                                {v} ⭐
                            </option>
                        ))}
                    </select>

                    <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Submit Review
                    </button>
                </div>
            )}

            {authUser && completedBookings.length === 0 && (
                <p className="text-gray-500">You can review this service only after completing a booking.</p>
            )}

            <div className="space-y-4">
                {reviews.map((r) => (
                    <div key={r.id} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-semibold">{r.userName}</div>
                                <div>{"⭐".repeat(r.rating)}</div>
                                {!editingReviewId || editingReviewId !== r.id ? (
                                    <p className="text-slate-700">{r.comment}</p>
                                ) : (
                                    <div className="mt-2">
                                        <textarea
                                            value={editComment}
                                            onChange={(e) => setEditComment(e.target.value)}
                                            className="w-full border p-2 rounded mb-2"
                                        />
                                        <select
                                            value={editRating}
                                            onChange={(e) => setEditRating(Number(e.target.value))}
                                            className="border p-1 rounded mb-2"
                                        >
                                            {[5, 4, 3, 2, 1].map((v) => (
                                                <option key={v} value={v}>
                                                    {v} ⭐
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                {/* Edit button only for owner */}
                                {authUser && r.userId === authUser.id && !editingReviewId && (
                                    <button onClick={() => startEdit(r)} className="text-blue-600">
                                        Edit
                                    </button>
                                )}
                                {editingReviewId === r.id && (
                                    <>
                                        <button onClick={submitEdit} className="text-green-600">
                                            Save
                                        </button>
                                        <button onClick={cancelEdit} className="text-gray-600">
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {authUser && (r.userId === authUser.id || authUser.role === "admin") && (
                                    <button onClick={() => handleDelete(r.id)} className="text-red-600">
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Review;
